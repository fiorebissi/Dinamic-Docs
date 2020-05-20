import React from 'react';
import { Link } from 'react-router-dom';

const IndexPpal = () => {
  return (
    <main className='bg-white w-full h-full'>
      <div className='w-full h-full flex items-center justify-center flex-col p-2 m-3 min-w-full min-h-screen'>
        <Link to='/home/documentosDinamicos' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-4'>
          Documentos Dinamicos
        </Link>
        <Link to='/home/Pdfs' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
          Pdfs
        </Link>
      </div>

    </main>
  );
};

export default IndexPpal;
