import React, { useState } from 'react';

const FileForm = () => {

  const [dataDOM, setDataDOM] = useState(null);

  const handleClick = (e) => {
    e.preventDefault();
    const formData = new FormData(document.forms.namedItem('formCsv'));
    const miInit = {
      method: 'POST',
      body: formData,
      // credentials: 'include',
    };
    fetch('http://www.rchdynamic.com.ar/dd/document/create/excel', miInit)
    // fetch('http://localhost:3000/dd/document/create/excel', miInit)
      .then((response) => response.json())
      .catch((error) => console.error('Error:', error))
      .then((response) => {
        console.log('Success:', response);
        setDataDOM(response);
      });
  };

  return (
    <main className='bg-white w-full h-full flex flex-col items-center content-center justify-center min-h-screen'>
      <form encType='multipart/form-data' method='post' name='formCsv'>
        <input className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2 rounded focus:outline-none focus:shadow-outline' type='file' name='fileCSV' id='file' required />
        <button onClick={(e) => handleClick(e)} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2 rounded focus:outline-none focus:shadow-outline' type='button' value='Enviar'>Enviar</button>
      </form>
      <table className='border-collapse border-2 border-gray-500'>
        <thead>
          <tr>
            <th className='px-4 py-2'>Nombre</th>
            <th className='px-4 py-2'>Apellido</th>
            <th className='px-4 py-2'>Email</th>
            <th className='px-4 py-2'>Empresa</th>
          </tr>
        </thead>
        <tbody>
          {dataDOM && dataDOM.body.list_user.map((data, index) => {
            const { firstName, lastName, email, enterprise } = data;
            return (
              <tr key={index.id}>
                <td className='border px-4 py-2'>{firstName}</td>
                <td className='border px-4 py-2'>{lastName}</td>
                <td className='border px-4 py-2'>{email}</td>
                <td className='border px-4 py-2'>{enterprise}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>

  );
};

export default FileForm;
