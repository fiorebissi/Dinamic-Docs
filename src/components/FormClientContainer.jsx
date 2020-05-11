import React from 'react';
import Template from './Template';
import FormClient from './FormClient';

const FormContainer = () => {
  return (
    <main className='bg-white w-full h-full items-center justify-center'>
      <div className='grid-cols-2 flex flex-row'>
        <div><Template /></div>
        <div><FormClient /></div>

      </div>

    </main>

  );
};

export default FormContainer;
