import React, { useState, useRef, useEffect } from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import LoaderDualRing from './LoaderDualRing';

const Send = () => {
  const [isDisabled, setIsDisabled] = useState(true);
  const id = useRef(null);
  const petition = () => {
    const header = { method: 'POST',
      body: JSON.stringify({
        'name_template': 'mailing',
        'to': document.getElementById('email').value,
        'variables': {
          '{{firstName}}': localStorage.getItem('nombreEnvio'),
          '{{lastName}}': localStorage.getItem('apellidoEnvio'),
          '{{email}}': document.getElementById('email').value,
          '{{enterprise}}': document.getElementById('enterprise').value,
        },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      // credentials: 'include',
    };

    return fetch('http://www.rchdynamic.com.ar/dd/mailing/', header)
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        Swal.fire('Ramon Chozas S.A', error, 'error');
        console.log(error);
        return { status: 401 };
      })
      .then((response) => {
        console.log(response);
        if (response.status && response.status === 401) {
          return null;
        }
        return response;
      });
  };

  const handleCreate = (e) => {
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
            if (response) {
              Swal.fire('Ramon Chozas S.A', 'Mailing creado con exito!', 'success');
              setIsDisabled(false);
              id.current = response.body._id;
            }
          });
      },
    });
  };

  const enviar = () => {
    console.log('hola');
    const header = { method: 'POST',
      body: JSON.stringify({
        'id': id.current,
        'to': document.getElementById('email').value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      // credentials: 'include',
    };

    fetch('http://www.rchdynamic.com.ar/dd/mailing/send', header)
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        Swal.fire('Ramon Chozas S.A', error, 'error');
        console.log(error);
        return { status: 401 };
      })
      .then((response) => {
        console.log(response);
        if (response.status && response.status === 401) {
          return null;
        }
        Swal.fire('Ramon Chozas S.A', 'Mailing enviado con exito!', 'success');
        return 1;
      });
  };

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, []);

  return (
    <div className='animated fadeIn px-4'>
      <h1 className='text-gray-700 text-xl font-bold text-center'>Mailing</h1>
      <form onSubmit={(e) => handleCreate(e)} className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 space-y-4'>
        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
          Email
          <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id='email' type='email' placeholder='Email' required />
        </label>
        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='enterprise'>
          Empresa
          <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id='enterprise' type='text' placeholder='Empresa' required />
        </label>
        <div className='flex flex-col justify-between space-y-4'>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-75 disabled:cursor-not-allowed' type='submit' disabled={!isDisabled}>
            Crear Mailing
          </button>
          <button onClick={() => enviar()} type='button' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-75 disabled:cursor-not-allowed' disabled={isDisabled}>
            Enviar Mailing
          </button>
        </div>
      </form>
    </div>
  );
};

export default Send;
