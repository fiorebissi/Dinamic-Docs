import React, { useState } from 'react';
import Template from '../components/Template';
import { deviceIs } from '../funciones';
import FileDD from '../components/FileDD';

const FileForm = ({ templates }) => {
  const [dataMailing, setDataMailing] = useState({
    send: false,
    firstName: '',
    lastName: '',
  });
  const [dataDOM, setDataDOM] = useState(null);
  const [step, setStep] = useState(0);
  const [templatedSelected, setTemplatedSelected] = useState(null);

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
      })
      .then((response) => {
        const url = `data:text/html;base64,${response.body.base64}`;
        const a = document.createElement('a');
        a.href = url;
        a.download = 'filename.html';
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove(); //afterwards we remove the element again
      });
  };

  return (
    <main className='animated fadeIn lg:grid lg:grid-cols-2'>
      { deviceIs() === 'desktop' && <Template setTemplatedSelected={setTemplatedSelected} templates={{ ...templates, step }} /> }
      <div className='bg-white w-full h-full flex flex-col justify-center items-center'>
        <FileDD templatedSelected={templatedSelected} setStep={setStep} setDataMailing={setDataMailing} />
        {dataDOM && dataDOM.body.count <= 20 ? (
          <table className='border-dotted border-4 border-blue-600 border-opacity-75 rounded-lg shadow-xl'>
            <thead>
              <tr>
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
                    <td className='border px-4 py-2'>{firstName}</td>
                    <td className='border px-4 py-2'>{lastName}</td>
                    <td className='border px-4 py-2'>{email}</td>
                    <td className='border px-4 py-2'>{enterprise}</td>
                    <td className='h-full w-full flex justify-center items-center'>
                      <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded' type='button' onClick={() => handleDownload(id + 1)}>Generar</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : dataDOM && <div><p>{`La cantidad de registros es: ${dataDOM.body.count}`}</p></div>}
      </div>
    </main>

  );
};

export default FileForm;
