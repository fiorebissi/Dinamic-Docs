import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import Firmar from '../components/Firmar';
import { b64toBlob } from '../funciones';

const FirmaDigital = () => {
  const [pdf, setPdf] = useState(null);
  const [url, setUrl] = useState(false);
  const { id } = useParams();
  useEffect(() => {
    const header = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`http://www.rchdynamic.com.ar/dd/document/read/pdf/encrypt/${id}`, header)
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        Swal.fire('Error al traer el PDF para firmar', error, 'error');
        console.log(error);
      })
      .then((response) => {
        console.log(response);
        setPdf(response.body.base64);
      });
  }, []);

  const send = () => {
    const header = {
      method: 'POST',
      body: JSON.stringify({
        encrypted_id: id,
        sign: document.querySelector('#canvas').toDataURL(),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch('http://www.rchdynamic.com.ar/dd/document/create/pdf/sign', header)
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        Swal.fire('Error al traer el PDF para firmar', error, 'error');
        console.log(error);
      })
      .then((response) => {
        console.log(response);
        setUrl(window.URL.createObjectURL(b64toBlob(response.body.base64)));
        Swal.fire({
          icon: 'success',
          title: 'Ramon Chozas S.A',
          showConfirmButton: false,
          timer: 2000,
        });
      });
  };

  return (
    <div>
      <div>
        <object height='900' width='500' aria-label='Tu pdf' data={`data:application/pdf;base64,${pdf}`} />
      </div>
      <Firmar />
      <button onClick={send} type='button' className='mt-4'>¡Firmar!</button>
      {url &&
      <a download='hola.pdf' href={url} title='Download pdf document'>hola</a>}
    </div>
  );
};

export default FirmaDigital;
