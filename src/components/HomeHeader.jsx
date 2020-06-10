import React from 'react';
import { Link } from 'react-router-dom';
import logoChozas from '../assets/static/logo_chozas2.png';
import imgPerfil from '../assets/static/user.svg';
import '../assets/styles/homeHeader.css';

const HomeHeader = ({ title }) => {
  const item = JSON.parse(localStorage.getItem('user'));
  const { user: { firstName, lastName } } = item || { user: { firstName: undefined, lastName: undefined } };
  return (
    <header className='Home__header text-white bg-blue-600 shadow border-b-2 border-blue-900 w-screen flex items-center'>
      <div className='flex items-center justify-between container mx-auto'>
        <Link to='/home' className='w-20 lg:w-24'>
          <img className='object-contain h-full w-full' src={logoChozas} alt='Logo Chozas' />
        </Link>
        <div className='flex-col items-center justify-center hidden md:flex'>
          <h1 className='text-2xl'>Ramon Chozas S.A</h1>
          <h2 className='text-lg'>{title}</h2>
        </div>
        <div>
          <div className='flex justify-end items-center div_perfil'>
            <div className='w-12 lg:w-16 '>
              <img className='rounded-full object-contain h-full w-full' src={imgPerfil} alt='Perfil' />
            </div>
            <div className='ml-4 text-xl hidden md:block'>
              <p>{`${firstName || null} ${lastName || null}`}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
