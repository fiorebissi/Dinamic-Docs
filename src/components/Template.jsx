import React, { useEffect, useState } from 'react';
import Galicia from '../assets/static/galicia_template.jpg';
import mailing from '../assets/static/mailing.png';
import zurich from '../assets/static/Zurich_template.jpg';
import '../assets/styles/template.css';

const Template = ({ setTemplate }) => {

  const [dataDOM, setDataDOM] = useState(null);

  useEffect(() => {
    const miInit = {
      method: 'GET',
      // credentials: 'include',
    };
    fetch('http://www.rchdynamic.com.ar/dd/template/read/all', miInit)
    // fetch('http://localhost:3000/dd/document/create/excel', miInit)
      .then((response) => response.json())
      .catch((error) => console.error('Error:', error))
      .then((response) => {
        console.log('Success:', response);
        setDataDOM(response);
        setTimeout(() => {
          const template2 = document.getElementById('template1');
          const galicia = document.getElementById('template0');
          if (galicia.classList.contains('w-64')) {
            galicia.classList.replace('w-64', 'w-56');
          }
          template2.classList.replace('w-56', 'w-64');
        }, 0);
      });
  }, []);

  const handleClick = (n) => {
    const galicia = document.getElementById('template0');
    const template2 = document.getElementById('template1');
    //const zurich = document.getElementById('template2');
    const zurich = template2;
    switch (n) {
      case 0:
        setTemplate('galicia');
        if (template2.classList.contains('w-64') || zurich.classList.contains('w-64')) {
          template2.classList.replace('w-64', 'w-56');
          zurich.classList.replace('w-64', 'w-56');
        }
        galicia.classList.replace('w-56', 'w-64');
        break;
      case 1:
        setTemplate('mailing');
        if (galicia.classList.contains('w-64') || zurich.classList.contains('w-64')) {
          galicia.classList.replace('w-64', 'w-56');
          zurich.classList.replace('w-64', 'w-56');
        }
        template2.classList.replace('w-56', 'w-64');
        break;
      case 2:
        setTemplate('zurich');
        if (galicia.classList.contains('w-64') || template2.classList.contains('w-64')) {
          galicia.classList.replace('w-64', 'w-56');
          template2.classList.replace('w-64', 'w-56');
        }
        zurich.classList.replace('w-56', 'w-64');
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
          } else if (data === 'mailing.html') {
            img = mailing;
          } else if (data === 'zurich.pdf') {
            img = zurich;
          } else {
            return null;
          }
          return (
            <div onClick={(n) => handleClick(id)} key={id} id={`template${id}`} tabIndex={id} role='button' className='w-56 h-full hover:w-64 m-2 border-gray-900 hover:border-gray-500 border-2 rounded cursor-pointer' data-template='galicia'>
              <img className='object-contain' src={img} alt={data} />
            </div>
          );
        })}
      </div>
    </main>

  );
};

export default Template;

