import React from 'react';
import Swal from 'sweetalert2';

const FileDD = ({ setDataMailing, templatedSelected, setDataDOM }) => {

  const handleClick = (e) => {
    e.preventDefault();
    if (templatedSelected === null) {
      Swal.fire('Ramon Chozas S.A', 'Debe seleccionar un template!', 'warning');
    }
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
      .catch((error) => {
        Swal.fire('Ramon Chozas S.A', error, 'error');
        console.log(error);
        return { type: 'error' };
      })
      .then((response) => {
        Swal.fire({
          title: 'Ramon Chozas S.A',
          text: 'Datos Cargados y Generados',
          icon: 'success',
          showCancelButton: true,
          confirmButtonColor: '#007ace',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cerrar',
          confirmButtonText: 'Enviar Documentos Dinamicos',
        }).then((result) => {
          if (result.value) {
            Swal.fire(
              'Ramon Chozas S.A',
              'Enviados',
              'success',
            );
          }
        });
        console.log('Success:', response);
        setDataDOM(response);
        // Swal.fire({
        //   icon: 'question',
        //   title: '¿Le gustaría enviarlo por mail?',
        //   confirmButtonText: 'Si',
        //   cancelButtonText: 'No',
        //   showCancelButton: true,
        //   reverseButtons: true,
        //   allowOutsideClick: false,
        // }).then((resolve) => {
        //   if (resolve) {
        //     setStep(1);
        //     setDataMailing({
        //       send: true,
        //       ...dataSend.current,
        //     });
        //   }
        // });
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
