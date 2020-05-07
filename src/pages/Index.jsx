import React from 'react';
// import { Link } from 'react-router-dom';
import Logo from '../assets/static/logo_chozas2.png';
import '../assets/styles/login.css';

const Index = () => {
  return (
    <main className='Login w-full h-full'>
      <div className='w-48 mb-8' id='imgChozas'>
        <img className='object-contain h-full w-full' src={Logo} alt='Logo' />
      </div>
      <div className='w-full h-full flex items-center justify-center'>
        <button type='button' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4'>
          Formulario Cliente
        </button>
        <button type='button' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
          Formulario Lista Clientes (Excell)
        </button>
      </div>

    </main>
  );
};

export default Index;

// const Index = () => {
//   return (

// <main className='Login w-full h-full'>
//       <div className='w-48 mb-8' id='imgChozas'>
//         <img className='object-contain h-full w-full' src={Logo} alt='Logo' />
//       </div>
//       <div className='w-full h-full flex items-center justify-center'>
//         <Link to='/FormClient' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4'>Formulario Cliente</Link>

//         <Link to='/FileForm ' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Formulario Lista Clientes (Excell)</Link>
//       </div>

//     </main>
// );
// };
