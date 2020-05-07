import React from 'react';
import '../assets/styles/login.css';

const FileForm = () => {
  return (
    <main className='Login w-full h-full flex flex-row'>
      <h1 className='text-6xl text-white'>Lista de Clientes</h1>
      <input className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2 rounded focus:outline-none focus:shadow-outline' type='file' name='' id='' />
      <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2 rounded focus:outline-none focus:shadow-outline' type='button'>Enviar</button>
    </main>

  );
};

export default FileForm;
