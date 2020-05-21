import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useParams, useHistory } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import Firmar from '../components/Firmar';
import { b64toBlob } from '../funciones';
import LoaderDualRing from '../components/LoaderDualRing';
import arrow from '../assets/static/arrow.svg';
import '../assets/styles/resumePage.css';

const FirmaDigital = () => {
  const [pdf, setPdf] = useState(null);
  const [url, setUrl] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const history = useHistory();
  const { id } = useParams();
  useEffect(() => {
    const header = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`http://www.rchdynamic.com.ar/dd/document/read/pdf/encrypt/${id}`, header)
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        Swal.fire('Error al traer el PDF para firmar', error, 'error');
        console.log(error);
      })
      .then((response) => {
        console.log(response);
        setPdf(response.body.base64);
      });
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const petition = () => {
    const header = {
      method: 'POST',
      body: JSON.stringify({
        encrypted_id: id,
        sign: document.querySelector('#canvas').toDataURL(),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    return fetch('http://www.rchdynamic.com.ar/dd/document/create/pdf/sign', header)
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        Swal.fire('Error al traer el PDF para firmar', error, 'error');
        console.log(error);
      })
      .then((response) => {
        return response.body.base64;
      });
  };

  const send = () => {
    const MySwal = withReactContent(Swal);
    Swal.fire({
      title: '¿Enviar Firma?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        MySwal.fire({
          title: 'Enviando Información...',
          html: (
            <LoaderDualRing />
          ),
          showConfirmButton: false,
          onRender: () => {
            petition()
              .then((response) => {
                MySwal.close();
                setUrl(window.URL.createObjectURL(b64toBlob(response)));
                document.querySelector('#link').dispatchEvent(new MouseEvent('click'));
                Swal.fire({
                  icon: 'success',
                  title: 'Ramon Chozas S.A',
                  showConfirmButton: false,
                  timer: 2000,
                  hideClass: {
                    popup: 'animated fadeOut',
                  },
                  onDestroy: () => {
                    history.push('/home');
                  },
                });
              });
          },
        });
      }
    });
  };

  return (
    <div className='animated fadeIn py-6'>
      <h2 className='text-gray-900 text-xl font-bold mb-2 text-center pb-4'>Paso: 2/2</h2>
      <div className='flex flex-col justify-center items-center'>
        <p className='text-center text-gray-700 font-bold text-lg'>
          {`Pagina ${pageNumber} de ${numPages}`}
        </p>
        <div className='flex justify-around'>
          <div className={`flex items-center ${pageNumber <= 1 && 'invisible'}`}>
            <button type='button' onClick={() => setPageNumber(pageNumber - 1)} className='w-8 h-8'>
              <img className='object-contain' src={arrow} alt='Atras' />
            </button>
          </div>
          <div id='ResumeContainer'>
            <Document
              className='PDFDocument'
              file={`data:application/pdf;base64,${pdf}`}
              onLoadSuccess={onDocumentLoadSuccess}
              error='Error al mostrar el PDF'
              loading='Cargando PDF...'
              noData='No existe PDF'
            >
              <Page pageNumber={pageNumber} className='PDFPage' renderTextLayer={false} renderInteractiveForms={false} scale={2.5} />
            </Document>
          </div>
          <div className={`flex items-center ${pageNumber >= numPages && 'invisible'}`}>
            <button type='button' onClick={() => setPageNumber(pageNumber + 1)} className='w-8 h-8 rotate-180 transform'>
              <img className='object-contain' src={arrow} alt='Atras' />
            </button>
          </div>
        </div>
        <p className='text-center text-gray-700 font-bold text-lg'>
          {`Pagina ${pageNumber} de ${numPages}`}
        </p>
      </div>

      <div className='flex justify-center mt-4'>
        <div className='max-w-sm w-full h-64'>
          <Firmar />
        </div>
      </div>
      <div className='mt-4 text-center'>
        <button onClick={send} type='button' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>¡Firmar!</button>
      </div>
      {url && (
        <div className='text-center hidden'>
          <a id='link' className='underline text-blue-500 hover:text-blue-700' download={`zurich${id}.pdf`} href={url} title='Download pdf document'>hola</a>
        </div>
      )}
    </div>
  );
};

export default FirmaDigital;
