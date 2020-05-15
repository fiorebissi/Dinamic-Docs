import React, { useState } from 'react';
import Template from './Template';
import FormClient from './FormClient';
import FormGalicia from './FormGalicia';

const FormContainer = () => {
  const [template, setTemplate] = useState('mailing')
  return (
    <main className='bg-white w-full h-full items-center justify-center content-between'>
      <div className='grid-cols-2 flex flex-row w-full h-full'>
        <div><Template setTemplate={setTemplate} /></div>
        {template === "mailing" ?
          <div><FormClient template={template} /></div>
        : <div><FormGalicia template={template} /></div>
        }
      </div>
    </main>

  );
};

export default FormContainer;
