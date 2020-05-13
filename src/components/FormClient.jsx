import React from 'react';
import swal from 'sweetalert';

const FormClient = () => {

  const handleDownload = () => {
    const header = { method: 'POST',
      body: JSON.stringify({
        'name_template': 'mailing',
        'last_name': document.getElementById('lastname').value,
        'first_name': document.getElementById('firstname').value,
        'email': document.getElementById('email').value,
        'enterprise': document.getElementById('empresa').value,
        'is_download_file': true,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      // credentials: 'include',
    };
    fetch('http://www.rchdynamic.com.ar/dd/document/create', header)
      .then((resp) => {
        return resp.blob();
      }).then((blob) => {
        swal('Ramon Chozas S.A', 'Se ha descargado el archivo correctamente', 'success');
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
    const header = { method: 'POST',
      body: JSON.stringify({
        'name_template': 'mailing',
        'last_name': document.getElementById('lastname').value,
        'first_name': document.getElementById('firstname').value,
        'email': document.getElementById('email').value,
        'enterprise': document.getElementById('empresa').value,
        'is_download_file': false,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      // credentials: 'include',
    };
    fetch('http://www.rchdynamic.com.ar/dd/document/create', header)
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        swal('Ramon Chozas S.A', error, 'error');
        console.log(error);
      })
      .then((response) => {
        console.log(response);
        swal('Ramon Chozas S.A', response.message, 'success');
      });

  };
  return (
    <main className='pt-8 w-full h-full items-center flex flex-col justify-center min-w-full min-h-full'>
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
        <div className='mb-6'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
            Email
            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id='email' type='text' placeholder='Email' />
          </label>
        </div>
        <div className='mb-6'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='empresa'>
            Empresa
            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id='empresa' type='text' placeholder='Empresa' />
          </label>
        </div>
        <div className='flex items-center justify-between'>
          <button onClick={handleDownload} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type='button'>
            Descargar
          </button>
          <button onClick={handleSend} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type='button'>
            Enviar
          </button>
        </div>
      </form>
    </main>
  );
};

export default FormClient;
