import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useHistory } from 'react-router-dom';
import LoaderDualRing from './LoaderDualRing';

const PdfForm = () => {
  const history = useHistory();

  const send = () => {
    const header = { method: 'POST',
      body: JSON.stringify({
        'name_template': document.querySelector('#template').value,
        'variables': {
          firstName: document.getElementById('lastname').value,
          lastName: document.getElementById('firstname').value,
          date: new Date().toJSON().slice(0, 10).replace(/-/g, '-'),
          phone: document.getElementById('tel').value,
        },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    return fetch('http://www.rchdynamic.com.ar/dd/document/create/pdf/pdfToPdf', header)
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        Swal.fire('Ramon Chozas S.A', error, 'error');
        console.log(error);
      })
      .then((response) => {
        return response.body.url;
      });
  };

  const handleSubmit = (e) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: 'Enviando Información...',
      html: (
        <LoaderDualRing />
      ),
      showConfirmButton: false,
      onRender: () => {
        send()
          .then((response) => {
            MySwal.close();
            history.push(`/home/firmar/${response.split('firmar/')[1]}`);
          });
      },
    });
    e.preventDefault();
  };

  return (
    <main className='pt-8 w-full h-full items-center flex flex-col justify-center min-w-full min-h-full animated fadeIn' onSubmit={(e) => handleSubmit(e)}>
      <h2 className='text-gray-900 text-lg font-bold mb-2'>Paso: 1/2</h2>
      <form className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='template'>
          Formulario:
          <select id='template' className='block appearance-none w-full border text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline' required>
            <option value=''>---</option>
            <option value='zurich'>Zurich</option>
          </select>
        </label>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='name'>
            Nombre
            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id='firstname' type='text' placeholder='Nombre' required />
          </label>
        </div>
        <div className='mb-6'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='lastname'>
            Apellido
            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id='lastname' type='text' placeholder='Apellido' required />
          </label>
        </div>
        <div className='mb-6'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='tel'>
            Telefono
            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id='tel' type='number' placeholder='123...' required />
          </label>
        </div>
        <div className='flex items-center justify-end'>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type='submit'>
            Enviar
          </button>
        </div>
      </form>
    </main>

  );

};

export default PdfForm;
