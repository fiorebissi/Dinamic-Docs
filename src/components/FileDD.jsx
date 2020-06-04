import React from 'react';

const FileDD = ({ setDataMailing, templatedSelected }) => {

  const handleClick = (e) => {
    e.preventDefault();
    const formData = new FormData(document.forms.namedItem('formCsv'));
    const miInit = {
      method: 'POST',
      body: formData,
      // credentials: 'include',
    };
    console.log(templatedSelected);
    fetch(`http://www.rchdynamic.com.ar/dd/document/excel/${templatedSelected.data.name}`, miInit)
    // fetch('http://localhost:3000/dd/document/create/excel', miInit)
      .then((response) => response.json())
      .catch((error) => console.error('Error:', error))
      .then((response) => {
        console.log('Success:', response);
        setDataDOM(response);
      });
  };
  return (
    <form encType='multipart/form-data' method='post' name='formCsv'>
      <input className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2 rounded focus:outline-none focus:shadow-outline' type='file' name='fileCSV' id='file' required />
      <div className='text-center'>
        <button onClick={(e) => handleClick(e)} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2 rounded focus:outline-none focus:shadow-outline' type='button' value='Enviar'>Generar</button>
      </div>
    </form>
  );
};

export default FileDD;
