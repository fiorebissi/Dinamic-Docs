import React, { useState, useEffect } from 'react';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';
import PdfForm from '../components/PdfForm';
import UploadPdf from '../components/UploadPdf';
import { animateCSS } from '../funciones';
import zurich from '../assets/static/zurich.png';

const Pdf = () => {
  const history = useHistory();
  const location = useLocation();
  const [opcionSelected, setOpcionSelected] = useState(() => {
    const path = location.pathname.split('/');
    return path[3];
  });

  const goTo = (path) => {
    history.replace(`/home/pdfs/${path}`);
    animateCSS('.pdf_body', 'fadeIn');
  };

  const handleTemplate = (e) => {
    console.log(e.currentTarget);
  };

  useEffect(() => {
    const path = location.pathname.split('/');
    setOpcionSelected(path[3]);
  }, [location]);

  return (
    <div className='container mx-auto pt-8 animated fadeIn'>
      <div className='flex flex-col md:flex-row justify-center text-center space-y-4 md:space-y-0 md:space-x-4'>
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
      <h2 className='text-gray-900 text-lg font-bold mb-2 text-center py-4'>Paso: 1/2</h2>
      <div className='grid grid-cols-2'>
        <div className='grid grid-cols-3'>
          <button type='button' className='transform duration-200 hover:scale-110 border-2 hover:border-blue-700' onClick={(e) => handleTemplate(e)}>
            <img className='object-contain' src={zurich} alt='zurich' />
          </button>
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
    </div>
  );
};

export default Pdf;
