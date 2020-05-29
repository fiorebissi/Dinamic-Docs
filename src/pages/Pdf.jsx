import React, { useState, useEffect } from 'react';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';
import PdfForm from '../components/PdfForm';
import UploadPdf from '../components/UploadPdf';
import { animateCSS, deviceIs } from '../funciones';
import zurich from '../assets/static/zurich.png';

const Pdf = () => {
  const history = useHistory();
  const location = useLocation();
  const [opcionSelected, setOpcionSelected] = useState(() => {
    const path = location.pathname.split('/');
    return path[3];
  });
  const [formSelected, setFormSelected] = useState('poliza');

  const goTo = (path) => {
    history.replace(`/home/pdfs/${path}`);
    animateCSS('.pdf_body', 'fadeIn');
  };

  const handleTemplate = (e) => {
    setFormSelected(e.currentTarget.id);
    e.currentTarget.classList.add('scale-110', 'border-blue-700');
    e.currentTarget.classList.remove('hover:scale-110', 'hover:border-blue-700');
  };

  useEffect(() => {
    const path = location.pathname.split('/');
    setOpcionSelected(path[3]);
  }, [location]);

  useEffect(() => {
    if (deviceIs() === 'desktop') {
      document.querySelector('#poliza').classList.add('scale-110', 'border-blue-700');
      document.querySelector('#poliza').classList.remove('hover:scale-110', 'hover:border-blue-700');
    }
  });

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
      <div className='lg:grid lg:grid-cols-2'>
        { deviceIs() === 'desktop' && (
          <div className='grid-cols-2 gap-4 hidden lg:grid'>
            <button type='button' id='poliza' className='transform duration-200 hover:scale-110 border-2 hover:border-blue-700 rounded' onClick={(e) => handleTemplate(e)}>
              <img className='object-contain rounded' src={zurich} alt='zurich' />
            </button>
          </div>
        )}
        <div className='pdf_body'>
          <Switch>
            <Route exact path='/home/pdfs/manual'>
              <PdfForm formSelected={formSelected} />
            </Route>
            <Route exact path='/home/pdfs/upload'>
              <UploadPdf formSelected={formSelected} />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default Pdf;
