import React, { useState, useEffect } from 'react';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';
import FormGalicia from '../components/FormGalicia';
import FileForm from '../components/FileForm';
import Template from '../components/Template';
import { animateCSS, deviceIs } from '../funciones';
import Send from '../components/Send';
import Galicia from '../assets/static/galicia_template.jpg';

const Documento = () => {
  const history = useHistory();
  const location = useLocation();
  const [imageTemplate, setImageTemplate] = useState(Galicia);
  const [opSelect, setOpSelect] = useState(() => {
    const path = location.pathname.split('/');
    return path[3];
  });
  const [template, setTemplate] = useState('galicia');

  const goTo = (path) => {
    history.replace(`/home/documentosDinamicos/${path}`);
    animateCSS('.form_body', 'fadeIn');
  };

  useEffect(() => {
    const path = location.pathname.split('/');
    setOpSelect(path[3]);
  }, [location]);

  return (
    <div className='container mx-auto pt-8 animated fadeIn'>
      <div className='flex justify-center text-center space-x-4 px-2'>
        <div>
          <button onClick={() => goTo('formClient')} className={`${opSelect === 'formClient' ? 'bg-blue-700  shadow-outline' : 'bg-blue-500 hover:bg-blue-700 focus:outline-none focus:shadow-outline'} text-white font-bold py-2 px-4 rounded`} type='button'>
            Formulario Cliente
          </button>
        </div>
        <div>
          <button onClick={() => goTo('fileForm')} className={`${opSelect === 'fileForm' ? 'bg-blue-700 shadow-outline' : 'bg-blue-500 hover:bg-blue-700 focus:outline-none focus:shadow-outline'}  text-white font-bold py-2 px-4 rounded`} type='button'>
            Formulario Cliente (Csv)
          </button>
        </div>
      </div>
      <div className='lg:grid lg:grid-cols-2'>
        { deviceIs() === 'desktop' && <Template setTemplate={setTemplate} imageTemplate={imageTemplate} /> }
        <div className='form_body'>
          <Switch>
            <Route exact path='/home/documentosDinamicos/formClient'>
              <FormGalicia setImageTemplate={setImageTemplate} template={template} />
            </Route>
            <Route exact path='/home/documentosDinamicos/sendMailing'>
              <Send />
            </Route>
            <Route exact path='/home/documentosDinamicos/fileForm'>
              <FileForm template={template} />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default Documento;

