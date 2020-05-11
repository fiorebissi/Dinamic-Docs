import React from 'react';
import Galicia from '../assets/static/galicia_template.jpg';
import Template2 from '../assets/static/template_2.jpg';
import Template3 from '../assets/static/template_3.jpg';
import '../assets/styles/template.css';

const Template = () => {
  return (
    <main className='w-full h-full pt-8'>
      <h1 className='text-blue-600 text-2xl font-bold text-center'>Seleccione un Template:</h1>
      <div className='flex flex-row'>
        <div className='tam m-2 border-gray-900 hover:border-gray-500 border-2 rounded cursor-pointer'>
          <img src={Galicia} alt='Galicia Template' />
        </div>
        <div className='tam border-gray-900 hover:border-gray-500 border-2 rounded cursor-pointer'>
          <img src={Template2} alt='Template 2' />
        </div>
        <div className='tam m-2 border-gray-900 hover:border-gray-500 border-2 rounded cursor-pointer'>
          <img src={Template3} alt='Template 3' />
        </div>
      </div>
      <h3 className='text-center text-blue-600 text-2xl font-bold'>Usted ha seleccionado este Template:</h3>
    </main>

  );
};

export default Template;
