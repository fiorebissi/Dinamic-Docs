import React, { useState, useEffect } from 'react';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';
import PdfForm from '../components/PdfForm';
import UploadPdf from '../components/UploadPdf';
import { animateCSS } from '../funciones';

const Pdf = () => {
  const history = useHistory();
  const location = useLocation();
  const [opcionSelected, setOpcionSelected] = useState(() => {
    const path = location.pathname.split('/');
    return path[3];
  });

  const handleSendData = () => {
    const header = { method: 'POST',
      body: JSON.stringify({
        'name_template': template,
        'variables': {
          'date': document.getElementById('lastname').value,
          'firstName': document.getElementById('firstname').value,
          'lastName': document.getElementById('email').value,
          'sign': document.getElementById('enterprise').value,
        },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      // credentials: 'include',
    };
    fetch('http://www.rchdynamic.com.ar/dd/document/create/pdf/pdfToPdf', header)
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        swal('Ramon Chozas S.A', error, 'error');
        console.log(error);
      })
      .then((response) => {
        console.log(response);
        swal('Ramon Chozas S.A', response.message, 'success');
      });
  };

  const goTo = (path) => {
    history.push(`/home/pdfs/${path}`);
    animateCSS('.pdf_body', 'fadeIn');
  };

  useEffect(() => {
    const path = location.pathname.split('/');
    setOpcionSelected(path[3]);
  }, [location]);

  return (
    <div className='container mx-auto pt-8'>
      <div className='flex justify-center text-center space-x-4'>
        <div>
          <button onClick={() => goTo('manual')} className={`${opcionSelected === 'manual' ? 'bg-blue-700 shadow-outline' : 'bg-blue-500 hover:bg-blue-700 focus:outline-none focus:shadow-outline'}  text-white font-bold py-2 px-4 rounded`} type='button'>
            Cargar Datos Manualmente
          </button>
        </div>
        <div>
          <button onClick={() => goTo('upload')} className={`${opcionSelected === 'upload' ? 'bg-blue-700 shadow-outline' : 'bg-blue-500 hover:bg-blue-700 focus:outline-none focus:shadow-outline'}  text-white font-bold py-2 px-4 rounded`} type='button'>
            Subir PDF
          </button>
        </div>
      </div>
      <div className='pdf_body'>
        <Switch>
          <Route exact path='/home/pdfs/manual'>
            <PdfForm />
          </Route>
          <Route exact path='/home/pdfs/upload'>
            <UploadPdf />
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default Pdf;
