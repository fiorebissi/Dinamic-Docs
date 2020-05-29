import React from 'react';
import FormGalicia from './FormGalicia';

const FormContainer = ({ template }) => {
  return (
    <div className='bg-white w-full h-full items-center justify-center content-between'>
      <div className='grid-cols-2 sm:grid-cols-1 flex w-full h-full'>
        <div><FormGalicia template={template} /></div>
      </div>
    </div>
  );
};

export default FormContainer;
