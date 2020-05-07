import React from 'react';

const Form = ({ children, handleSubmit }) => {
  return (
    <form className='Form border-solid border-2 border-white rounded-lg shadow-2xl px-8 pt-6 pb-8 mb-4 animated fadeIn' onSubmit={handleSubmit}>
      <div className='Form-body'>
        {children}
      </div>
    </form>
  );
};

export default Form;
