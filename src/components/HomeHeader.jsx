import React from 'react';
import { Link } from 'react-router-dom';
import logoChozas from '../assets/static/logo_chozas2.png';
import imgPerfil from '../assets/static/user.svg';
import '../assets/styles/homeHeader.css';

const HomeHeader = ({ title }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const { vendedor } = user || { vendedor: { nombre: undefined, apellido: undefined } };
  const { nombre, apellido } = vendedor;
  return (
    <div className='Home__header flex items-center justify-around text-white bg-blue-600'>
      <div className='w-24'>
        <img className='object-contain h-full w-full' src={logoChozas} alt='Logo Chozas' />
      </div>
      <div className='flex flex-col items-center justify-center'>
        <h1 className='text-2xl'>Ramon Chozas S.A</h1>
        <h2 className='text-lg'>{title}</h2>
      </div>
      <Link to='/hr/configuracion'>
        <div className='flex justify-end items-center div_perfil'>
          <div className='w-16'>
            <img className='rounded-full object-contain h-full w-full' src={imgPerfil} alt='Perfil' />
          </div>
          <div className='ml-4 text-xl'>
            <p>{`${nombre || null} ${apellido || null}`}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default HomeHeader;
