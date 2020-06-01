import React from 'react';
import Loader from './Loader';
import '../assets/styles/PageLoading.css';

function PageLoading() {
  return (
    <div className='PageLoading'>
      <Loader />
    </div>
  );
}

export default PageLoading;
