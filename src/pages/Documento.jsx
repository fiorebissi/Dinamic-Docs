import React, { useState, useEffect } from 'react';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import FileForm from './FileForm';
import { animateCSS } from '../funciones';
import FormClient from './FormClient';

const Documento = () => {
  const history = useHistory();
  const location = useLocation();
  const [opSelect, setOpSelect] = useState(() => {
    const path = location.pathname.split('/');
    return path[3];
  });
  const [templatesData, setTemplatesData] = useState({
    state: false,
    body: {
      list_html: [],
      list_mailing: [],
    },
  });

  useEffect(() => {
    const miInit = {
      method: 'GET',
      // credentials: 'include',
    };
    fetch('http://www.rchdynamic.com.ar/dd/template', miInit)
    // fetch('http://localhost:3000/dd/document/create/excel', miInit)
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
        return { type: 'error' };
      })
      .then((response) => {
        console.log(response);
        if (response.type === 'success') {
          setTemplatesData({ ...response, state: true });
        } else {
          Swal.fire(
            'Error',
            'Hubo problemas al traer los templates',
            'error',
          );
        }
      });
  }, []);

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
      <div className='flex justify-center text-center space-x-4 px-2 pb-4'>
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
      <div className='form_body'>
        <Switch>
          <Route path='/home/documentosDinamicos/formClient'>
            <FormClient templates={templatesData} />
          </Route>
          <Route path='/home/documentosDinamicos/fileForm'>
            <FileForm templates={templatesData} />
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default Documento;

