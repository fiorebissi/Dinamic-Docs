import React, { useState } from 'react';
import Template from '../components/Template';
import { deviceIs } from '../funciones';
import FileDD from '../components/FileDD';
import Send from '../components/Send';

const FileForm = ({ templates }) => {
  const [dataDOM, setDataDOM] = useState(null);
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

  const handleDownload = (index) => {
    const miInit = {
      method: 'GET',
      // credentials: 'include',
    };
    fetch(`http://www.rchdynamic.com.ar/dd/document/${index}`, miInit)
    // fetch('http://localhost:3000/dd/document/create/excel', miInit)
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        Swal.fire('Ramon Chozas S.A', error, 'error');
        console.log(error);
        return { type: 'error' };
      })
      .then((response) => {
        console.log(response);
        if (response.type === 'error') {
          Swal.fire(
            'Ramon Chozas S.A',
            response.message,
            'error',
          );
        } else {
          const url = `data:text/html;base64,${response.body.base64}`;
          const a = document.createElement('a');
          a.href = url;
          a.download = 'filename.html';
          document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
          a.click();
          a.remove(); //afterwards we remove the element again
        }
      });
  };

  return (
    <main className='animated fadeIn'>
      <div className='lg:grid lg:grid-cols-2 relative'>
        {step === 1 && (
          <div className='absolute z-10 bg-black opacity-75 top-0 left-0 w-full h-full rounded transform scale-105' />
        )}
        { deviceIs() === 'desktop' && <Template setMailingSelected={setMailingSelected} setTemplatedSelected={setTemplatedSelected} templates={{ ...templates, step }} /> }
        <div className='bg-white w-full h-full flex flex-col justify-center items-center'>
          <FileDD templatedSelected={templatedSelected} setDataDOM={setDataDOM} setStep={setStep} setDataMailing={setDataMailing} />
          {dataDOM && dataDOM.body.count <= 20 ? (
            <table className='border-dotted border-4 border-blue-600 border-opacity-75 rounded-lg shadow-xl pt-8'>
              <thead>
                <tr>
                  <th className='px-4 py-2'> </th>
                  <th className='px-4 py-2'>Nombre</th>
                  <th className='px-4 py-2'>Apellido</th>
                  <th className='px-4 py-2'>Email</th>
                  <th className='px-4 py-2'>Empresa</th>
                  <th className='px-4 py-2 font-bold'>Descargar</th>
                </tr>
              </thead>
              <tbody>
                {dataDOM.body.list_user.map((data, index) => {
                  const { firstName, lastName, email, enterprise } = data;
                  console.log(data);
                  const id = index;
                  return (
                    <tr key={id}>
                      <td className='border px-4 py-2'><input className='mr-2 leading-tight' type='checkbox' /></td>
                      <td className='border px-4 py-2'>{firstName}</td>
                      <td className='border px-4 py-2'>{lastName}</td>
                      <td className='border px-4 py-2'>{email}</td>
                      <td className='border px-4 py-2'>{enterprise}</td>
                      <td className='h-full w-full flex justify-center items-center'>
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded' type='button' onClick={() => handleDownload(id + 1)}>Enviar</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : dataDOM && <div><p>{`La cantidad de registros es: ${dataDOM.body.count}`}</p></div>}
        </div>
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
    </main>

  );
};

export default FileForm;
