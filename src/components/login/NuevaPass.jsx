import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Form from './Form';
import BackToLogin from './BackToLogin';
import '../../assets/styles/form.css';
import Input from './Input';
import Modal from '../Modal';
import { animateCSS } from '../../funciones';

const NuevaPass = () => {
  const [information, setInformation] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const history = useHistory();

  const handleChange = (e) => {
    if (e.target.classList.contains('border-red-500')) {
      e.target.classList.remove('border-red-500');
    }
    if (document.querySelector('#username').value && document.querySelector('#password').value && document.querySelector('#newPassword').value && document.querySelector('#confirmNewPassword').value) {
      document.querySelector('.button_submit_Form').classList.remove('opacity-50', 'cursor-not-allowed');
      document.querySelector('.button_submit_Form').removeAttribute('disabled');
    } else {
      if (!document.querySelector('.button_submit_Form').hasAttribute('disabled')) {
        document.querySelector('.button_submit_Form').setAttribute('disabled', '');
        document.querySelector('.button_submit_Form').classList.add('opacity-50', 'cursor-not-allowed');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    document.body.classList.add('cursor-wait');
    document.querySelector('.button_submit_Form').setAttribute('disabled', '');
    document.querySelector('.button_submit_Form').classList.add('opacity-50', 'cursor-not-allowed');
    //expired();
    if (!information) {
      animateCSS('.p_information', 'fadeOut faster', () => {
        setInformation('🕑 Validando los datos... 🕑');
        animateCSS('.p_information', 'fadeIn faster');
      });
    } else {
      animateCSS('.p_information', 'fadeIn faster', () => {
        setInformation('🕑 Validando los datos... 🕑');
      });
    }
  };

  const handleCorrect = () => {
    animateCSS('.Modal__container', 'slideOutUp faster', () => {
      history.push('/');
    });
    animateCSS('.Modal', 'fadeOut faster');
  };

  useEffect(() => {
    /*ipcRenderer.on('reply-expired-password', (event, argsJSON) => {
      console.table(argsJSON);
      document.getElementById('username').focus();
      const { message, code } = argsJSON;
      const username = document.querySelector('#username');
      const password = document.querySelector('#password');
      const newPassword = document.querySelector('#newPassword');
      const confirmNewPassword = document.querySelector('#confirmNewPassword');
      document.body.classList.remove('cursor-wait');
      if (code === 200) {
        setInformation('');
        setModalIsOpen(true);
      } else if (code >= 400) {
        document.querySelector('.button_submit_Form').removeAttribute('disabled');
        document.querySelector('.button_submit_Form').classList.remove('opacity-50', 'cursor-not-allowed');
        if (code === 400) {
          newPassword.classList.add('border-red-500');
        } else if (code === 401) {
          newPassword.classList.add('border-red-500');
          confirmNewPassword.classList.add('border-red-500');
        } else if (code === 402) {
          username.classList.add('border-red-500');
        } else if (code === 403) {
          password.classList.add('border-red-500');
        }
        animateCSS('.p_information', 'fadeOut faster', () => {
          setInformation(`⚠ ${message}`);
          animateCSS('.p_information', 'fadeIn faster');
        });
      }
    });*/
  }, []);

  return (
    <>
      <Form handleSubmit={handleSubmit}>
        <BackToLogin />
        <div className='my-4'>
          <h2 className='text-center text-lg font-bold'>Contraseña Vencida</h2>
        </div>
        <Input handleChange={handleChange} id='username' placeholder='Ingresar Usuario' type='text'>Usuario:</Input>
        <Input handleChange={handleChange} id='password' placeholder='Ingrese contraseña actual' type='password'>Contraseña Actual:</Input>
        <Input handleChange={handleChange} id='newPassword' placeholder='Ingrese nueva contraseña' type='password' textBottom='Debe incluir minimo un número, una mayuscula, un caracter especial y debe tener minimo 8 caracteres.'>Nueva Contraseña:</Input>
        <Input handleChange={handleChange} id='confirmNewPassword' placeholder='Confirmar nueva contraseña' type='password'>Confirme Nueva Contraseña:</Input>
        <div className='div_information text-center text-red-500 text-xs my-4'>
          <p className='p_information'>{information}</p>
        </div>
        <div className='flex items-center justify-center mt-6'>
          <button type='submit' className='button_submit_Form bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline opacity-50 cursor-not-allowed' disabled>Enviar</button>
        </div>
      </Form>
      <Modal isOpen={modalIsOpen} onClose={handleCorrect}>
        <div className='text-black text-center'>
          <div className='my-2'>
            <p className='p-2'>¡Nueva ontraseña establecida con exito!</p>
          </div>
          <div className='flex w-full justify-end mt-6'>
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded' type='button' onClick={handleCorrect}>Volver</button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default NuevaPass;
