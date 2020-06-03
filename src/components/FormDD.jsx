import React from 'react';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import { deviceIs } from '../funciones';
import LoaderDualRing from './LoaderDualRing';

const FormDD = ({ setDataMailing }) => {

  const history = useHistory();

  const petition = () => {
    const header = { method: 'POST',
      body: JSON.stringify({
        'name_template': 'galicia.html',
        'variables': {
          '{{firstName}}': document.getElementById('firstname').value,
          '{{lastName}}': document.getElementById('lastname').value,
          '{{gender}}': document.getElementById('gender').value,
          '{{city}}': document.getElementById('Ciudad').value,
        },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    // credentials: 'include',
    };

    return fetch('http://www.rchdynamic.com.ar/dd/document/', header)
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
        return response;
      });
  };

  const handleSend = (e) => {
    e.preventDefault();
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: 'Enviando Información...',
      html: (
        <LoaderDualRing />
      ),
      showConfirmButton: false,
      allowOutsideClick: false,
      onRender: () => {
        petition()
          .then((response) => {
            console.log(response);
            console.log(response.type);
            if (response.type === 'error') {
              Swal.fire('Error al generar el Documento Dinamico', response.message, 'error');
            } else {
              Swal.fire('Ramon Chozas S.A', response.message, 'success').then(() => {
                const url = `data:text/html;base64,${response.body.base64}`;
                const a = document.createElement('a');
                a.href = url;
                a.download = 'filename.html';
                document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
                a.click();
                a.remove(); //afterwards we remove the element again
              }).then(() => {
                Swal.fire({
                  icon: 'question',
                  title: '¿Le gustaría enviarlo por mail?',
                  confirmButtonText: 'Si',
                  cancelButtonText: 'No',
                  showCancelButton: true,
                  reverseButtons: true,
                  allowOutsideClick: false,
                }).then((resolve) => {
                  if (resolve) {
                    setStep(1);
                    setDataMailing({
                      send: true,
                      firstName: document.getElementById('firstname').value,
                      lastName: document.getElementById('lastname').value,
                    });
                    history.push('/home/documentosDinamicos/sendMailing');
                  }
                });
              });
            }
          });
      },
    });
  };

  return (
    <main className='w-full h-full items-center flex flex-col justify-center min-w-full min-h-full'>
      <h1 className='text-gray-700 text-xl font-bold capitalize'>Galicia</h1>
      <form onSubmit={(e) => handleSend(e)} className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 space-y-4'>
        { deviceIs() === 'mobile' && (
          <label className='block text-gray-700 text-sm font-bold mb-2 lg:hidden' htmlFor='template'>
            Formulario:
            <select id='template' className='block appearance-none w-full border text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline' required>
              <option value=''>---</option>
              <option value='poliza'>Poliza</option>
            </select>
          </label>
        )}
        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='name'>
          Nombre
          <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id='firstname' type='text' placeholder='Nombre' required />
        </label>
        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='lastname'>
          Apellido
          <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id='lastname' type='text' placeholder='Apellido' required />
        </label>
        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='gender'>
          Genero:
          <select className='block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500' name='gender' id='gender' required>
            <option value='o'>---</option>
            <option value='o'>Masculino</option>
            <option value='a'>Femenino</option>
          </select>
        </label>
        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='Ciudad'>
          Ciudad
          <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id='Ciudad' type='text' placeholder='Ciudad' required />
        </label>
        <div className='flex items-center justify-between'>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type='submit'>
            Generar Documento Dinamico
          </button>
        </div>
      </form>
    </main>
  );
};

export default FormDD;
