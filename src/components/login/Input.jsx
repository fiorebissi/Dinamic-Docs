import React from 'react';

const Input = ({ id, placeholder, children, handleChange, type, textBottom }) => {
  return (
    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor={id}>
      {children}
      <input style={{ backgroundColor: 'white', }} onChange={handleChange} autoComplete={id} className='mt-1 h-10 shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline' name={id} id={id} type={type} placeholder={placeholder} tabIndex={0} required />
      <p className='text-gray-600 text-xs italic'>{textBottom}</p>
    </label>
  );
};

export default Input;
