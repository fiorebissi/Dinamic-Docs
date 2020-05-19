import React, { useState } from 'react';
import Template from './Template';

const FileForm = () => {

  const [dataDOM, setDataDOM] = useState(null);
  const [template, setTemplate] = useState('mailing');
  const handleClick = (e) => {
    e.preventDefault();
    const formData = new FormData(document.forms.namedItem('formCsv'));
    const miInit = {
      method: 'POST',
      body: formData,
      // credentials: 'include',
    };
    fetch(`http://www.rchdynamic.com.ar/dd/document/create/excel/${template}`, miInit)
    // fetch('http://localhost:3000/dd/document/create/excel', miInit)
      .then((response) => response.json())
      .catch((error) => console.error('Error:', error))
      .then((response) => {
        console.log('Success:', response);
        setDataDOM(response);
      });
  };

  const handleDownload = (index, tipoarch) => {
    const miInit = {
      method: 'GET',
      // credentials: 'include',
    };
    fetch(`http://www.rchdynamic.com.ar/dd/document/read/${tipoarch}/${index}`, miInit)
    // fetch('http://localhost:3000/dd/document/create/excel', miInit)
      .then((response) => response.blob())
      .catch((error) => console.error('Error:', error))
      .then((response) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'filename.html';
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove(); //afterwards we remove the element again
      });
  };

  return (
    <main className='bg-white w-full h-full flex flex-col justify-center items-center min-h-screen'>
      {/*<Template setTemplate={setTemplate} />*/}
      <form encType='multipart/form-data' method='post' name='formCsv'>
        <input className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2 rounded focus:outline-none focus:shadow-outline' type='file' name='fileCSV' id='file' required />
        <button onClick={(e) => handleClick(e)} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2 rounded focus:outline-none focus:shadow-outline' type='button' value='Enviar'>Enviar</button>
      </form>
      {dataDOM && (
        <table className='border-dotted border-4 border-blue-600 border-opacity-75 rounded-lg shadow-xl'>
          <thead>
            <tr>
              <th className='px-4 py-2'>Nombre</th>
              <th className='px-4 py-2'>Apellido</th>
              <th className='px-4 py-2'>Email</th>
              <th className='px-4 py-2'>Empresa</th>
              <th className='px-4 py-2 font-bold'>Descargar</th>
            </tr>
          </thead>
          <tbody>
            {dataDOM.body.list_user.map((data, index) => {
              const { firstName, lastName, email, enterprise } = data;
              console.log(data);
              const id = index;
              return (
                <tr key={id}>
                  <td className='border px-4 py-2'>{firstName}</td>
                  <td className='border px-4 py-2'>{lastName}</td>
                  <td className='border px-4 py-2'>{email}</td>
                  <td className='border px-4 py-2'>{enterprise}</td>
                  <td className='h-full w-full flex justify-center items-center'>
                    <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded' type='button' onClick={() => handleDownload(id + 1, 'html')}>Download</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </main>

  );
};

export default FileForm;
