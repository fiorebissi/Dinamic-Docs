import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useHistory } from 'react-router-dom';
import LoaderDualRing from './LoaderDualRing';
import { deviceIs } from '../funciones';

const PdfForm = ({ formSelected }) => {
  const history = useHistory();

  const send = () => {
    const header = { method: 'POST',
      body: JSON.stringify({
        'name_template': deviceIs() === 'desktop' ? formSelected : document.querySelector('#template').value,
        'variables': {
          firstName: document.getElementById('firstname').value,
          lastName: document.getElementById('lastname').value,
          date: new Date().toJSON().slice(0, 10).replace(/-/g, '-'),
          phone: document.getElementById('tel').value,
        },
      }),
      headers: {
        'Content-Type': 'application/json',
        credentials: 'include',
      },
    };
    return fetch('http://www.rchdynamic.com.ar/dd/pdf/pdfToPdf', header)
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        Swal.fire('Ramon Chozas S.A', 'No autorizado', 'error');
        console.log(error);
        return { status: 401 };
      })
      .then((response) => {
        console.log(response);
        return response.status;
      });
  };

  const handleSubmit = (e) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: <p className='text-lg md:text-xl'>Enviando Información...</p>,
      html: (
        <LoaderDualRing />
      ),
      showConfirmButton: false,
      allowOutsideClick: false,
      onRender: () => {
        send()
          .then((response) => {
            if (response === 201) {
              Swal.fire({
                icon: 'success',
                title: '¡Enviado con éxito!',
                text: 'Recibirá un mensaje de texto al teléfono que proporcionó con el link para firmar la documentación',
                onDestroy: () => {
                  history.push('/home');
                },
              });
            }
            //history.push(`/home/firmar/${response.split('firmar/')[1]}`);
          });
      },
    });
    e.preventDefault();
  };

  return (
    <main className='w-full h-full items-center flex flex-col justify-center min-w-full min-h-full animated fadeIn'>
      <form className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4' onSubmit={(e) => handleSubmit(e)}>
        <label className='block text-gray-700 text-sm font-bold mb-2 lg:hidden' htmlFor='template'>
          Formulario:
          <select id='template' className='block appearance-none w-full border text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline' required={deviceIs() === 'mobile'}>
            <option value=''>---</option>
            <option value='poliza'>Poliza</option>
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
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type='submit' disabled={deviceIs() === 'desktop' && !formSelected}>
            Enviar
          </button>
        </div>
      </form>
    </main>

  );

};

export default PdfForm;
