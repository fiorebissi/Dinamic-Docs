import React, { useRef, useEffect } from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import LoaderDualRing from './LoaderDualRing';
import LabelInput from './LabelInput';

const Send = ({ dataMailing, mailingSelected }) => {
  const id = useRef(null);

  const petition = () => {
    const data = [];
    mailingSelected.variables.forEach((variable) => {
      const { key, name } = variable;
      const flag = Object.keys(dataMailing).some((data) => {
        return key === data;
      });
      if (flag) {
        data[`${key}`] = dataMailing[key];
      } else {
        data[`${key}`] = document.querySelector(`#${name}`).value;
      }
    });

    const header = { method: 'POST',
      body: JSON.stringify({
        'name_template': mailingSelected.name,
        'to': document.getElementById('email').value,
        'variables': {
          ...data,
        },
        'document_id': dataMailing.document_id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      // credentials: 'include',
    };

    return fetch('http://www.rchdynamic.com.ar/dd/mailing/create-and-send/', header)
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        Swal.fire('Ramon Chozas S.A', error, 'error');
        console.log(error);
        return { type: 'error' };
      })
      .then((response) => {
        console.log(response);
        return response;
      });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: 'Enviando Información...',
      html: (
        <LoaderDualRing />
      ),
      showConfirmButton: false,
      allowOutsideClick: false,
      onRender: () => {
        petition()
          .then((response) => {
            if (response.type === 'success') {
              Swal.fire('Ramon Chozas S.A', 'Mailing creado con exito!', 'success');
              id.current = response.body.id;
            } else {
              Swal.fire('Ramon Chozas S.A', response.message, 'error');
            }
          });
      },
    });
  };

  /*const enviar = () => {

    const header = { method: 'POST',
      body: JSON.stringify({
        'id': id.current,
        'to': document.getElementById('email').value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      // credentials: 'include',
    };

    fetch('http://www.rchdynamic.com.ar/dd/mailing/send', header)
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        console.log(error);
        return { type: 'error' };
      })
      .then((response) => {
        console.log(response);
        if (response.type === 'error') {
          Swal.fire('Ramon Chozas S.A', response.message, 'error');
        } else {
          Swal.fire('Ramon Chozas S.A', 'Mailing enviado con exito!', 'success');
        }
        return 1;
      });
  };*/

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, []);

  return (
    <div className='animated fadeIn px-4'>
      <h1 className='text-gray-700 text-xl font-bold text-center'>{mailingSelected.name}</h1>
      <form onSubmit={(e) => handleCreate(e)} className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 space-y-4'>
        { mailingSelected.variables.map((variable, index) => {
          const { id, key, name, type } = variable;
          const flag = Object.keys(dataMailing).some((data) => {
            return key === data;
          });
          if (flag) {
            return null;
          }
          return (
            <LabelInput key={key} type={type} name={name} />
          );
        })}
        <div className='flex flex-col justify-between space-y-4'>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-75 disabled:cursor-not-allowed' type='submit'>
            Enviar Mailing
          </button>
          {/*<button onClick={enviar} type='button' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-75 disabled:cursor-not-allowed' disabled={isDisabled}>
            Enviar Mailing
      </button>*/}
        </div>
      </form>
    </div>
  );
};

export default Send;
