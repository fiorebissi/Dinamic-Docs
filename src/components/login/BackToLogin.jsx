import React from 'react';
import { Link } from 'react-router-dom';

const BackToLogin = () => {
  return (
    <div className='w-full'>
      <Link to='/form' className='text-center italic hover:underline'>Ir al Login</Link>
    </div>
  );
};

export default BackToLogin;
