import React from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <main className='bg-white w-full h-full'>
      <div className='w-full h-full flex items-center justify-center flex-col p-2 m-3 min-w-full min-h-screen'>
        <Link to='/home/formularioCliente' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-4'>
          Formulario Cliente
        </Link>
        <Link to='/home/fileForm' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
          Formulario Lista Clientes (Csv)
        </Link>
      </div>

    </main>
  );
};

export default Index;

