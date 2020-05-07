import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
//import { ipcRenderer } from 'electron';
//import { login } from '../renderer-process';
import FormDetails from './FormDetails';
import { animateCSS } from '../../funciones';
import ver from '../../assets/static/ver.svg';
import noVer from '../../assets/static/noVer.svg';

const FormContainer = () => {
  const [information, setInformation] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const history = useHistory();

  const handleCloseModal = () => {
    animateCSS('.Modal__container', 'slideOutUp faster', () => {
      setModalIsOpen(false);
      document.querySelector('.button_submit_Form').removeAttribute('disabled');
      document.querySelector('.button_submit_Form').classList.remove('opacity-50', 'cursor-not-allowed');
      setInformation(`⚠ ${message}`);
    });
    animateCSS('.Modal', 'fadeOut faster');
  };

  const handleOpenModal = () => {
    setModalIsOpen(true);
  };

  const handlePasswordExpired = () => {
    animateCSS('.Form', 'fadeOut faster', () => {
      history.push('/expired');
    });
  };

  const responseLogin = (response, authorization) => {
    console.log(response);
    document.body.classList.remove('cursor-wait');
    if (!response || response.result === 'error') {
      document.querySelector('.button_submit_Form').removeAttribute('disabled');
      document.querySelector('.button_submit_Form').classList.remove('opacity-50', 'cursor-not-allowed');
      animateCSS('.p_information', 'fadeOut faster', () => {
        setInformation(`⚠️ ${!response ? 'Error' : response.message}`);
        animateCSS('.p_information', 'fadeIn faster');
      });
    } else if (response.result === 'success') {
      localStorage.setItem('user', JSON.stringify(response.body));
      localStorage.setItem('authorization', authorization);
      animateCSS('.Login', 'fadeOut faster', () => {
        history.push('/hr');
      });
    }
  };

  const handleSubmit = (e) => {
    const username = document.querySelector('#username');
    const password = document.querySelector('#password');
    let authorization;
    e.preventDefault();
    document.body.classList.add('cursor-wait');
    document.querySelector('.button_submit_Form').setAttribute('disabled', '');
    document.querySelector('.button_submit_Form').classList.add('opacity-50', 'cursor-not-allowed');

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

    const header = { method: 'POST',
      body: JSON.stringify({
        'alias': username.value,
        'contraseña': password.value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    };

    fetch('http://www.dynamicdoc.com.ar/hoja_de_ruta/login', header)
      .then((response) => {
        authorization = response.headers.get('authorization');
        authorization = 'Bearer '.concat(authorization);
        return response.json();
      })
      .catch((error) => {
        console.log(error);
      })
      .then((response) => {
        responseLogin(response, authorization);
      });
  };

  const handleSwitchVisiblePass = () => {
    const inputPass = document.querySelector('#password');
    if (inputPass.getAttribute('type') === 'password') {
      inputPass.setAttribute('type', 'text');
      document.querySelector('.img__visiblePass').src = noVer;
    } else {
      inputPass.setAttribute('type', 'password');
      document.querySelector('.img__visiblePass').src = ver;
    }
  };
  useEffect(() => {
    document.getElementById('username').focus();
  }, []);

  return (
    <>
      <FormDetails
        information={information}
        modalIsOpen={modalIsOpen}
        handles={
          {
            handleCloseModal,
            handlePasswordExpired,
            handleSubmit,
            handleSwitchVisiblePass,
          }
        }
      />
    </>
  );
};

export default FormContainer;
