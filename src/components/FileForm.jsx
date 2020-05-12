import React from 'react';

const FileForm = () => {

  const handleClick = () => {
    const header = { method: 'POST',
      body: document.querySelector('#file').files[0],
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    // credentials: 'include',
    };
    fetch('http://www.rchdynamic.com.ar/dd/document/create/excel', header)
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        console.log(error);
      })
      .then((response) => {
        console.log(response);
      });

  };
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log('Hola');
  // };
  return (
    <main className='bg-white w-full h-full flex flex-col items-center content-center justify-center min-h-screen'>
      <button onClick={handleClick} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2 rounded focus:outline-none focus:shadow-outline' type='button'>Enviar</button>
      <form method='POST' action='http://www.rchdynamic.com.ar/dd/document/create/excel'>
        <input className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2 rounded focus:outline-none focus:shadow-outline' type='file' name='file' id='file' />
        <button type='submit'>Enviar</button>

      </form>
    </main>

  );
};

// onSubmit={(e) => handleSubmit(e)}

export default FileForm;
