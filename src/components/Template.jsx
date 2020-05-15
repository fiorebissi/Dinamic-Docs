import React from 'react';
import Galicia from '../assets/static/galicia_template.jpg';
import Template2 from '../assets/static/template_2.jpg';
import Template3 from '../assets/static/template_3.jpg';
import '../assets/styles/template.css';

const Template = () => {

  const handleClick = (n) => {
    const galicia = document.getElementById('galicia');
    const template2 = document.getElementById('template2');
    const template3 = document.getElementById('template3');
    switch (n) {
      case 0:
        console.log('Galicia');
        if (template2.classList.contains('w-64') || template3.classList.contains('w-64')) {
          template2.classList.replace('w-64', 'w-56');
          template3.classList.replace('w-64', 'w-56');
        }
        galicia.classList.replace('w-56', 'w-64');
        break;
      case 1:
        console.log('Template 2');
        if (galicia.classList.contains('w-64') || template3.classList.contains('w-64')) {
          galicia.classList.replace('w-64', 'w-56');
          template3.classList.replace('w-64', 'w-56');
        }
        template2.classList.replace('w-56', 'w-64');
        break;
      case 2:
        console.log('Template 3');
        if (template2.classList.contains('w-64') || galicia.classList.contains('w-64')) {
          template2.classList.replace('w-64', 'w-56');
          galicia.classList.replace('w-64', 'w-56');
        }
        template3.classList.replace('w-56', 'w-64');
        break;
    }
  };

  return (
    <main className='w-full h-full pt-8'>
      <h1 className='text-blue-600 text-2xl font-bold text-center'>Seleccione un Template:</h1>
      <div className='flex flex-row'>
        <div onClick={(n) => handleClick(0)} id='galicia' className='w-56 h-full hover:w-64 m-2 border-gray-900 hover:border-gray-500 border-2 rounded cursor-pointer' data-template='galicia'>
          <img src={Galicia} alt='Galicia Template' />
        </div>
        <div onClick={(n) => handleClick(1)} id='template2' className='w-56 h-full m-2 border-gray-900 hover:border-gray-500 border-2 rounded cursor-pointer' data-template='template2'>
          <img src={Template2} alt='Template 2' />
        </div>
        <div onClick={(n) => handleClick(2)} id='template3' className='w-56 h-full m-2 border-gray-900 hover:border-gray-500 border-2 rounded cursor-pointer' data-template='template3'>
          <img src={Template3} alt='Template 3' />
        </div>
      </div>
    </main>

  );
};

export default Template;

// {/* <main className='w-full h-full pt-8'>
//       <h1 className='text-blue-600 text-2xl font-bold text-center'>Seleccione un Template:</h1>
//       <div className='flex flex-row'>
//         <div id='galicia' className='tam m-2 border-gray-900 hover:border-gray-500 border-2 rounded cursor-pointer' data-template='galicia'>
//           <img src={Galicia} alt='Galicia Template' />
//         </div>
//         <div id='template2' className='tam m-2 border-gray-900 hover:border-gray-500 border-2 rounded cursor-pointer' data-template='template2'>
//           <img src={Template2} alt='Template 2' />
//         </div>
//         <div id='template3' className='tam m-2 border-gray-900 hover:border-gray-500 border-2 rounded cursor-pointer' data-template='template3'>
//           <img src={Template3} alt='Template 3' />
//         </div>
//       </div>
//     </main> */}
