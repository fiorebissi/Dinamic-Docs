import React, { useState } from 'react';
import FormDD from '../components/FormDD';
import Send from '../components/Send';
import Template from '../components/Template';
import { deviceIs } from '../funciones';

const FormClient = ({ templates }) => {
  const [dataMailing, setDataMailing] = useState({
    send: false,
    firstName: '',
    lastName: '',
  });
  const [step, setStep] = useState(0);

  return (
    <div>
      <div className='lg:grid lg:grid-cols-2 relative'>
        {step === 1 && (
          <div className='absolute z-10 bg-black opacity-75 top-0 left-0 w-full h-full' />
        )}
        { deviceIs() === 'desktop' && <Template templates={{ ...templates, step }} /> }
        <FormDD setStep={setStep} setDataMailing={setDataMailing} />
      </div>
      {dataMailing.send && (
        <div>
          <div>
            <button type='button' onClick={() => { setStep(0); }}>Volver al paso anterior</button>
          </div>
          <div className='lg:grid lg:grid-cols-2'>
            { deviceIs() === 'desktop' && <Template templates={{ ...templates, step }} /> }
            <Send />
          </div>
        </div>
      )}
    </div>
  );
};

export default FormClient;
