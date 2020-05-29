import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { useParams, useHistory } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import Firmar from '../components/Firmar';
import { deviceIs, animateCSS, viewportOrientation } from '../funciones';
import LoaderDualRing from '../components/LoaderDualRing';
import arrow from '../assets/static/arrow.svg';
import girar from '../assets/static/rotate.svg';
import '../assets/styles/resumePage.css';
import ModalFirma from '../components/ModalFirma';

const FirmaDigital = () => {
  const [pdf, setPdf] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const history = useHistory();
  const { id } = useParams();
  const canvasSize = useRef({
    height: 0,
    width: 0,
  });
  useEffect(() => {
    const header = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    fetch(`http://www.rchdynamic.com.ar/dd/pdf/encrypt/${id}`, header)
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        Swal.fire('Error al traer el PDF para firmar', 'error', 'error');
        console.log(error);
      })
      .then((response) => {
        console.log(response);
        if (response.type === 'error') {
          Swal.fire('Error al traer el PDF para firmar', response.message, 'error');
        } else {
          setPdf(response.body.base64);
        }
      });
  }, []);

  const rotate = () => {
    if (viewportOrientation() === 'landscape') {
      Swal.close();
      setIsOpen(true);
    }
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('resize', rotate);
    };
  });

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const resizeCanvas = (height, width) => {
    const resizedCanvas = document.createElement('canvas');
    const resizedContext = resizedCanvas.getContext('2d');

    resizedCanvas.height = height;
    resizedCanvas.width = width;

    const canvas = document.querySelector('#canvas');
    const context = canvas.getContext('2d');

    resizedContext.drawImage(canvas, 0, 0, height, width);
    return resizedCanvas;
  };

  const petition = () => {
    //const canvas = resizeCanvas(30, 175);
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
    return fetch('http://www.rchdynamic.com.ar/dd/pdf/sign', header)
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        Swal.fire('Error al traer el PDF para firmar', error, 'error');
        console.log(error);
        return { status: 401 };
      })
      .then((response) => {
        if (response.status && response.status === 401) {
          return null;
        }
        console.log(response);
        return response.body.base64;
      });
  };

  const sendFirma = () => {
    const MySwal = withReactContent(Swal);
    Swal.fire({
      title: '¿Confirma la Firma?',
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
          allowOutsideClick: false,
          onRender: () => {
            petition()
              .then((response) => {
                if (!response) {
                  Swal.fire('Error al traer el PDF para firmar', error, 'error');
                } else {
                  Swal.fire({
                    icon: 'success',
                    title: 'Ramon Chozas S.A',
                    showConfirmButton: false,
                    timer: 2000,
                    onDestroy: () => {
                      localStorage.setItem('verFirma', response);
                      history.replace('/home/firmar/verFirma');
                    },
                  });
                }
              });
          },
        });
      }
    });
  };

  const handleCloseModal = () => {
    animateCSS('.Modal', 'fadeOut faster');
    animateCSS('.Modal__container', 'slideOutUp faster', () => {
      setIsOpen(false);
    });
  };

  return (
    <div className='animated fadeIn py-6'>
      <div className='flex flex-col justify-center items-center'>
        <p className='text-center text-gray-700 font-bold text-lg'>
          {pdf && `Pagina ${pageNumber} de ${numPages}`}
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
              file={pdf && `data:application/pdf;base64,${pdf}`}
              onLoadSuccess={onDocumentLoadSuccess}
              error={<p className='text-lg text-red-700'>Error al mostrar el PDF</p>}
              loading={<LoaderDualRing />}
              noData={<p className='text-lg text-red-700'>No existe PDF</p>}
            >
              <Page
                onLoadSuccess={(page) => {
                  if (page.pageNumber === 1) {
                    canvasSize.current = {
                      height: document.querySelector('.react-pdf__Page__canvas').offsetHeight,
                      width: document.querySelector('.react-pdf__Page__canvas').offsetWidth,
                    };
                  }
                }}
                pageNumber={pageNumber}
                className='PDFPage'
                renderTextLayer={false}
                scale={2.5}
                loading={<div className='flex items-center justify-center' style={{ height: `${canvasSize.current.height}px`, width: `${canvasSize.current.width}px` }}><LoaderDualRing /></div>}
              />
            </Document>
          </div>
          <div className={`flex items-center ${pageNumber >= numPages && 'invisible'}`}>
            <button type='button' onClick={() => setPageNumber(pageNumber + 1)} className='w-8 h-8 rotate-180 transform'>
              <img className='object-contain' src={arrow} alt='Atras' />
            </button>
          </div>
        </div>
        <p className='text-center text-gray-700 font-bold text-lg'>
          {pdf && `Pagina ${pageNumber} de ${numPages}`}
        </p>
      </div>

      {deviceIs() === 'desktop' ? (
        <div className='flex justify-center mt-4'>
          <div className='max-w-sm w-full h-64'>
            <Firmar />
          </div>
        </div>
      ) :
        (<ModalFirma setIsOpen={setIsOpen} isOpen={isOpen} handleCloseModal={handleCloseModal} confirm={sendFirma} />)}
      {pdf && (
        <div className='mt-4 text-center'>
          <button
            onClick={deviceIs() === 'desktop' ? sendFirma : () => {
              if (viewportOrientation() === 'portrait') {
                Swal.fire({
                  title: 'Debe girar su pantalla',
                  imageUrl: girar,
                  imageWidth: 400,
                  imageHeight: 200,
                  imageAlt: 'Girrar pantalla',
                });
                window.addEventListener('resize', rotate);
              } else {
                setIsOpen(true);
              }
            }}
            type='button'
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          >
            ¡Firmar!
          </button>
        </div>
      )}
    </div>
  );
};

export default FirmaDigital;
