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
  const [templatedSelected, setTemplatedSelected] = useState(null);
  const [mailingSelected, setMailingSelected] = useState(null);

  const reset = () => {
    setStep(0);
    setTemplatedSelected(null);
    setMailingSelected(null);
    setDataMailing({
      send: false,
      firstName: '',
      lastName: '',
    });
  };

  return (
    <div>
      <div className='lg:grid lg:grid-cols-2 relative'>
        {step === 1 && (
          <div className='absolute z-10 bg-black opacity-75 top-0 left-0 w-full h-full rounded transform scale-105' />
        )}
        { deviceIs() === 'desktop' && <Template setMailingSelected={setMailingSelected} setTemplatedSelected={setTemplatedSelected} templates={{ ...templates, step }} /> }
        {templatedSelected &&
          <FormDD templatedSelected={templatedSelected} setStep={setStep} setDataMailing={setDataMailing} />}
      </div>
      {dataMailing.send && step === 1 && (
        <div className='pb-12'>
          <div className='text-center py-12'>
            <button type='button' onClick={reset} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Volver al paso anterior</button>
          </div>
          <div className='lg:grid lg:grid-cols-2'>
            { deviceIs() === 'desktop' && <Template setMailingSelected={setMailingSelected} setTemplatedSelected={setTemplatedSelected} templates={{ ...templates, step }} /> }
            {mailingSelected && mailingSelected.data && mailingSelected.data.type !== 'document' &&
            <Send mailingSelected={mailingSelected.data} dataMailing={dataMailing} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormClient;
