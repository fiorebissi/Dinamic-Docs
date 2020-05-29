import React, { useState } from 'react';
import Swal from 'sweetalert2';

const FormGalicia = ({ template }) => {
  const [isDisabled, setIsDisabled] = useState(true);

  const handleDownload = (index, tipoarch) => {
    const header = { method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // credentials: 'include',
    };
    fetch(`http://www.rchdynamic.com.ar/dd/document/read/${tipoarch}/${index}`, header)
      .then((resp) => {
        if (resp.status === 201) {
          reject('Error');
        }
        return resp.blob();
      }).catch((error) => {
        Swal.fire('Ramon Chozas S.A', error, 'error');
      })
      .then((blob) => {
        Swal.fire('Ramon Chozas S.A', 'Se ha descargado el archivo correctamente', 'success');
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'filename.html';
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove(); //afterwards we remove the element again
      });
    // .then((response) => {
    //   return response.json();
    // })
    // .catch((error) => {
    //   console.log(error);
    // })
    // .then((response) => {
    //   console.log(response);
    // });

  };
  const handleSend = () => {

    setIsDisabled(false);
    const BtnDescarga = document.getElementById('BtnDescarga');
    BtnDescarga.classList.remove('cursor-not-allowed', 'opacity-50');

    const header = { method: 'POST',
      body: JSON.stringify({
        'name_template': template,
        'variables': {
          '{{firstName}}': document.getElementById('lastname').value,
          '{{lastName}}': document.getElementById('firstname').value,
          '{{gender}}': document.getElementById('gender').value,
          '{{city}}': document.getElementById('Ciudad').value,
        },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      // credentials: 'include',
    };

    fetch('http://www.rchdynamic.com.ar/dd/document/', header)
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        Swal.fire('Ramon Chozas S.A', error, 'error');
        console.log(error);
      })
      .then((response) => {
        console.log(response);
        if (response.result !== 'html_created') {
          Swal.fire('Ramon Chozas S.A', response.message, 'error');
          return 0;
        }
        const url = `data:text/html;base64,${response.body.base64}`;
        const a = document.createElement('a');
        a.href = url;
        a.download = 'filename.html';
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove(); //afterwards we remove the element again
        Swal.fire('Ramon Chozas S.A', response.message, 'success');
        return 1;
      });

  };

  return (
    <main className='pt-8 w-full h-full items-center flex flex-col justify-center min-w-full min-h-full'>
      <h1 className='text-gray-700 text-xl font-bold'>{template}</h1>
      <form className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='name'>
            Nombre
            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id='firstname' type='text' placeholder='Nombre' />
          </label>
        </div>
        <div className='mb-6'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='lastname'>
            Apellido
            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id='lastname' type='text' placeholder='Apellido' />
          </label>
        </div>
        <label htmlFor='gender'>
          Genero:
          <select className='block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500' name='gender' id='gender' required>
            <option value='o'>---</option>
            <option value='o'>Masculino</option>
            <option value='a'>Femenino</option>
          </select>
        </label>
        <div className='mb-6'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='Ciudad'>
            Ciudad
            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id='Ciudad' type='text' placeholder='Ciudad' />
          </label>
        </div>
        <div className='flex items-center justify-between'>
          <button onClick={handleSend} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type='button'>
            Generar Documento Dinamico
          </button>
        </div>
      </form>
    </main>
  );
};

export default FormGalicia;
