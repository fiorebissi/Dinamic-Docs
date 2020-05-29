import React, { useEffect, useState } from 'react';
import Galicia from '../assets/static/galicia_template.jpg';
import '../assets/styles/template.css';

const Template = ({ setTemplate }) => {

  const [dataDOM, setDataDOM] = useState(null);

  useEffect(() => {
    const miInit = {
      method: 'GET',
      // credentials: 'include',
    };
    fetch('http://www.rchdynamic.com.ar/dd/template/all', miInit)
    // fetch('http://localhost:3000/dd/document/create/excel', miInit)
      .then((response) => response.json())
      .catch((error) => console.error('Error:', error))
      .then((response) => {
        console.log('Success:', response);
        setDataDOM(response);
        setTimeout(() => {
          const galicia = document.getElementById('galicia.html');
          if (galicia.classList.contains('w-64')) {
            galicia.classList.replace('w-64', 'w-56');
          }
        }, 0);
      });
  }, []);

  const handleClick = (n) => {
    const galicia = document.getElementById('galicia.html');
    switch (n) {
      case 0:
        setTemplate('galicia');
        galicia.classList.replace('w-56', 'w-64');
        break;
    }
  };

  return (
    <main className='w-full h-full pt-8'>
      <h1 className='text-blue-600 text-2xl font-bold text-center'>Seleccione un Template:</h1>
      <div className='flex flex-row items-center'>
        {dataDOM && dataDOM.body.list_html.map((data, index) => {
          const id = index;
          let img;
          if (data === 'galicia.html') {
            img = Galicia;
          } else {
            return null;
          }
          return (
            <div onClick={(n) => handleClick(id)} key={id} id={data} tabIndex={id} role='button' className='w-56 h-full hover:w-64 m-2 border-gray-900 hover:border-gray-500 border-2 rounded cursor-pointer'>
              <img className='object-contain' src={img} alt={data} />
            </div>
          );
        })}
      </div>
    </main>

  );
};

export default Template;

