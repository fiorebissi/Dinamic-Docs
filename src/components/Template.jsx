import React, { useEffect, useState, useRef } from 'react';
import '../assets/styles/template.css';
import LoaderDualRing from './LoaderDualRing';

const Template = ({ templates }) => {
  const [arrayTemplates, setArrayTemplates] = useState(null);
  const step = useRef(templates.step);
  const handleClick = (e) => {
    console.log(e.target);
  };

  useEffect(() => {
    switch (step) {
      case 0:
        setArrayTemplates(templates.body.list_html);
        break;
      case 1:
        setArrayTemplates(templates.body.list_mailing);
        break;
    }
  }, [templates]);

  return (
    <main className='w-full h-full hidden lg:flex lg:flex-col'>
      <h1 className='text-blue-600 text-2xl font-bold text-center'>Seleccione un Template:</h1>
      <div className='flex flex-row justify-center items-center flex-grow'>
        { !templates.state ? <LoaderDualRing /> : templates.type !== 'success' ?
          (
            <div>
              <h1 className='text-center text-xl text-red-700 font-bold'>¡Error!</h1>
            </div>
          ) : arrayTemplates && arrayTemplates.map((template, index) => {
            const id = index;
            return (
              <div onClick={(e) => handleClick(e)} key={id} tabIndex={id} role='button' className='w-56 h-full hover:w-64 m-2 border-gray-900 hover:border-gray-500 border-2 rounded cursor-pointer'>
                <img className='object-contain' src='' alt='' />
              </div>
            );
          })}
      </div>
    </main>
  );
};

export default Template;

