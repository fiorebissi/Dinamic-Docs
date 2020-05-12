import React from 'react';

const FileForm = () => {
  return (
    <main className='bg-white w-full h-full flex flex-col items-center content-center justify-center min-h-screen'>
      <input className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2 rounded focus:outline-none focus:shadow-outline' type='file' name='' id='' />
      <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2 rounded focus:outline-none focus:shadow-outline' type='button'>Enviar</button>
    </main>

  );
};

export default FileForm;
