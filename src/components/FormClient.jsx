import React from 'react';
import swal from 'sweetalert';

const FormClient = ({ template }) => {
  const handleDownload = (index, tipoarch) => {
    const header = { method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // credentials: 'include',
    };
    fetch(`http://www.rchdynamic.com.ar/dd/document/read/${tipoarch}/${index}`, header)
      .then((resp) => {
        console.log('Hola');
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
        'name_template': template,
        'variables': {
          '{{firstName}}': document.getElementById('lastname').value,
          '{{lastName}}': document.getElementById('firstname').value,
          '{{email}}': document.getElementById('email').value,
          '{{enterprise}}': document.getElementById('enterprise').value,
        },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      // credentials: 'include',
    };
    fetch('http://www.rchdynamic.com.ar/dd/document/create/html', header)
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

    if (BtnDescarga.classList.contains('cursor-not-allowed')) {
      BtnDescarga.classList.remove('opacity-50');
      BtnDescarga.classList.remove('cursor-not-allowed');
      BtnDescarga.classList.add('hover:bg-blue-700');
      BtnDescarga.classList.add('focus:outline-none');
      BtnDescarga.classList.add('focus:shadow-outline');
    }

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
        <div className='mb-6'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
            Email
            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id='email' type='text' placeholder='Email' />
          </label>
        </div>
        <div className='mb-6'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='empresa'>
            Empresa
            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id='enterprise' type='text' placeholder='Empresa' />
          </label>
        </div>
        {/* <div className='mb-6'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='empresa'>
            Tipo de Archivo
            <div className='relative'>
              <select className='block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500' id='grid-state'>
                <option>Html</option>
                <option>Pdf</option>
              </select>
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
                <svg className='fill-current h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' /></svg>
              </div>
            </div>
          </label>
        </div> */}
        <div className='flex items-center justify-between'>
          <button onClick={() => handleDownload(1, 'html')} className='bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed' id='BtnDescarga' type='button'>
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
