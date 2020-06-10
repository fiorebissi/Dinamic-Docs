import React, { useState, useEffect } from 'react';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';
import { useSpring, useTransition, animated } from 'react-spring';
import FileForm from './FileForm';
import FormClient from './FormClient';
import useFetch from '../hooks/useFetch';

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
  const { data } = useFetch('http://www.rchdynamic.com.ar/dd/template', 'Problemas al Traer los Templates');

  useEffect(() => {
    if (data && data.type === 'success') {
      setTemplatesData({ ...data, state: true });
    }
  }, [data]);

  const goTo = (path) => {
    history.replace(`/home/documentosDinamicos/${path}`);
  };

  useEffect(() => {
    const path = location.pathname.split('/');
    setOpSelect(path[3]);
  }, [location]);

  const transitions = useTransition(location, (location) => location.pathname, {
    from: { position: 'absolute', opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });
  const leftToRight = useSpring({
    to: { transform: 'translate(0px, 0px)' },
    from: { transform: 'translate(-500px, 0px)' },
  });
  const RightToLeft = useSpring({
    to: { transform: 'translate(0px, 0px)' },
    from: { transform: 'translate(500px, 0px)' },
  });
  return (
    <div className='container mx-auto pt-8 animated fadeIn'>
      <div className='flex justify-center text-center space-x-4 px-2 pb-4'>
        <animated.div style={leftToRight}>
          <button onClick={() => goTo('formClient')} className={`${opSelect === 'formClient' ? 'bg-blue-700  shadow-outline' : 'bg-blue-500 hover:bg-blue-700 focus:outline-none focus:shadow-outline'} text-white font-bold py-2 px-4 rounded`} type='button'>
            Formulario Cliente
          </button>
        </animated.div>
        <animated.div style={RightToLeft}>
          <button onClick={() => goTo('fileForm')} className={`${opSelect === 'fileForm' ? 'bg-blue-700 shadow-outline' : 'bg-blue-500 hover:bg-blue-700 focus:outline-none focus:shadow-outline'}  text-white font-bold py-2 px-4 rounded`} type='button'>
            Formulario Cliente (Csv)
          </button>
        </animated.div>
      </div>
      <div className='form_body relative'>
        {transitions.map(({ item: location, props, key }) => (
          <animated.div className='w-full' key={key} style={props}>
            <Switch location={location}>
              <Route path='/home/documentosDinamicos/formClient'>
                <FormClient templates={templatesData} />
              </Route>
              <Route path='/home/documentosDinamicos/fileForm'>
                <FileForm templates={templatesData} />
              </Route>
            </Switch>
          </animated.div>
        ))}
      </div>
    </div>
  );
};

export default Documento;

