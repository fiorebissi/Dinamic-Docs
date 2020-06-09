import React, { useState } from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import Template from '../components/Template';
import { deviceIs } from '../funciones';
import FileDD from '../components/FileDD';
import Send from '../components/Send';
import LoaderDualRing from '../components/LoaderDualRing';

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
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: 'Enviando Información...',
      html: (
        <LoaderDualRing />
      ),
      showConfirmButton: false,
      allowOutsideClick: false,
      onRender: () => {
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
              MySwal.close();
              const url = `data:text/html;base64,${response.body.base64}`;
              const a = document.createElement('a');
              a.href = url;
              a.download = 'filename.html';
              document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
              a.click();
              a.remove(); //afterwards we remove the element again
            }
          });
      },
    });
  };

  const goToNextStep = (id) => {
    const data = [];
    templatedSelected.data.variables.forEach((variable) => {
      const { key, name } = variable;
      data[`${key}`] = document.getElementById(`${id - 1}-${name}`).innerText;
    });
    setStep(1);
    setDataMailing({
      send: true,
      ...data,
      document_id: id,
    });
  };

  const selectAll = (e) => {
    if (e.currentTarget.checked) {
      document.querySelectorAll('.checkboxDownload').forEach((checkbox) => {
        const input = checkbox;
        input.checked = true;
      });
    } else {
      document.querySelectorAll('.checkboxDownload').forEach((checkbox) => {
        const input = checkbox;
        input.checked = false;
      });
    }
  };

  return (
    <main>
      <div className='lg:grid lg:grid-cols-2 relative'>
        {step === 1 && (
          <div className='absolute z-10 bg-black opacity-75 top-0 left-0 w-full h-full rounded transform scale-105 pb-8' />
        )}
        { deviceIs() === 'desktop' && <Template setMailingSelected={setMailingSelected} setTemplatedSelected={setTemplatedSelected} templates={{ ...templates, step }} /> }
        {templatedSelected && (
          <div className='bg-white w-full h-full flex flex-col justify-center items-center animated fadeIn'>
            <FileDD templatedSelected={templatedSelected} setDataDOM={setDataDOM} setStep={setStep} setDataMailing={setDataMailing} />
            {dataDOM && dataDOM.body.count <= 20 ? (
              <div className='max-w-full'>
                <div>
                  <p className='text-right font-bold'>{`Cantidad de Registros Cargados: ${dataDOM.body.count}`}</p>
                </div>
                <div className='overflow-x-auto'>
                  <table className='border-dotted border-4 border-blue-600 border-opacity-75 rounded-lg shadow-xl pt-8'>
                    <thead>
                      <tr>
                        <th>
                          <label className='flex flex-col py-2 px-1' htmlFor='allCheckbox'>
                            Seleccionar
                            <input id='allCheckbox' onChange={selectAll} className='leading-tight' type='checkbox' />
                          </label>
                        </th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                        <th>Empresa</th>
                        <th className='font-bold'>Enviar Mail</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataDOM.body.list_user.map((data, index) => {
                        const { firstName, lastName, email, enterprise } = data;
                        const id = index;
                        return (
                          <tr className='text-center text-sm' key={id}>
                            <td className='border p-1'>
                              <div className='flex justify-center items-center h-full w-full'>
                                <input className='leading-tight mt-1 checkboxDownload' type='checkbox' />
                              </div>
                            </td>
                            { templatedSelected.data.variables.map((variable) => {
                              const { id, name } = variable;
                              let tdText = '';
                              const keyIndex = index;

                              switch (id) {
                                case 1:
                                  tdText = firstName;
                                  break;
                                case 2:
                                  tdText = lastName;
                                  break;
                                case 3:
                                  tdText = email;
                                  break;
                                case 4:
                                  tdText = enterprise;
                                  break;
                              }
                              return (
                                <td key={`${keyIndex}-${name}`} className='border p-1' id={`${keyIndex}-${name}`}>{tdText}</td>
                              );
                            })}
                            <td className='border p-1 flax justify-center items-center'>
                              <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded' type='button' onClick={() => goToNextStep(id + 1)}>Enviar Mail</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className='flex p-4 space-x-4'>
                  <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded' type='button' onClick={() => handleDownload(id + 1)}>Generar Seleccionados</button>
                  <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded' type='button' onClick={() => handleDownload(id + 1)}>Generar Todos</button>
                </div>
              </div>
            ) : dataDOM && <div><p>{`La cantidad de registros es: ${dataDOM.body.count}`}</p></div>}
          </div>
        )}
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
