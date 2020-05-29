import React, { useState, useEffect } from 'react';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';
import FormClientContainer from '../components/FormClientContainer';
import FileForm from '../components/FileForm';
import Template from '../components/Template';
import { animateCSS } from '../funciones';

const Index = () => {
  const history = useHistory();
  const location = useLocation();
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
    <div className='container mx-auto pt-8'>
      <div className='flex justify-center text-center space-x-4'>
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
      <div className='grid grid-cols-2'>
        <div><Template setTemplate={setTemplate} /></div>
        <div className='form_body'>
          <Switch>
            <Route exact path='/home/documentosDinamicos/formClient'>
              <FormClientContainer template={template} />
            </Route>
            <Route exact path='/home/documentosDinamicos/fileForm'>
              <FileForm template={template} />
            </Route>
          </Switch>
        </div>
      </div>

    </div>
    // <main className='bg-white w-full h-full'>
    //   <div className='w-full h-full flex items-center justify-center flex-col p-2 m-3 min-w-full min-h-screen'>
    //     <Link to='/documentosDinamicos/formularioCliente' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-4'>
    //       Formulario Cliente
    //     </Link>
    //     <Link to='/documentosDinamicos/fileForm' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
    //       Formulario Lista Clientes (Csv)
    //     </Link>
    //   </div>

  // </main>
  );
};

export default Index;

