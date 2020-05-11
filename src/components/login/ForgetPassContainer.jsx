/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react';
import { animateCSS } from '../../funciones';
import ForgetPassDetails from './ForgetPassDetails';
//import { listSupervisor } from '../renderer-process';

const ForgetPassContainer = () => {

  const handleChange = () => {
    const userName = document.querySelector('#username').value;
    const dni = document.querySelector('#dni').value;
    if (userName && dni) {
      //listSupervisor({ userName, dni });
      document.querySelector('#btnForm').classList.remove('opacity-50', 'cursor-not-allowed');
      document.querySelector('#btnForm').removeAttribute('disabled');
    } else {
      if (!document.querySelector('#btnForm').hasAttribute('disabled')) {
        document.querySelector('#btnForm').setAttribute('disabled', '');
        document.querySelector('#btnForm').classList.add('opacity-50', 'cursor-not-allowed');
      }
    }
  };

  const handleChangeNext = () => {
    if (document.querySelector('#supervisor').value && document.querySelector('#username').value && document.querySelector('#dni').value) {
      document.querySelector('#btnForm').classList.remove('opacity-50', 'cursor-not-allowed');
      document.querySelector('#btnForm').removeAttribute('disabled');
    } else {
      if (!document.querySelector('#btnForm').hasAttribute('disabled')) {
        document.querySelector('#btnForm').setAttribute('disabled', '');
        document.querySelector('#btnForm').classList.add('opacity-50', 'cursor-not-allowed');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Se envio(?');
  };

  const handleOpenModal = () => {
    setModalIsOpen(true);
    setTippyVisible(false);
  };

  const handleCloseModal = () => {
    animateCSS('.Modal__container', 'slideOutUp faster', () => {
      setModalIsOpen(false);
    });
    animateCSS('.Modal', 'fadeOut faster');
  };

  const handleNextPage = (e) => {
    e.preventDefault();
    setData({
      title: 'Confirmar',
      step: 2,
      hasSupervisor: true,
      buttonText: 'Restaurar',
      handleSubmit,
      handleChange: handleChangeNext,
    });
    document.querySelector('.step1').classList.replace('bg-gray-700', 'bg-gray-500');
    document.querySelector('.step2').classList.replace('bg-gray-500', 'bg-gray-700');
    document.querySelector('#btnForm').setAttribute('disabled', '');
    document.querySelector('#btnForm').classList.add('opacity-50', 'cursor-not-allowed');
  };

  const [data, setData] = useState({
    title: 'Solicitud de Supervisores',
    step: 1,
    hasSupervisor: false,
    buttonText: 'Siguiente',
    handleSubmit: handleNextPage,
    handleChange,
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tippyVisible, setTippyVisible] = useState(true);

  useEffect(() => {
    const firstModal = localStorage.getItem('firstOpen');
    if (!firstModal) {
      localStorage.setItem('firstOpen', true);
      setTippyVisible(false);
      setModalIsOpen(true);
    }
  }, []);
  return (
    <ForgetPassDetails
      title={data.title}
      step={data.step}
      hasSupervisor={data.hasSupervisor}
      buttonText={data.buttonText}
      handles={
        {
          handleChange: data.handleChange,
          handleSubmit: data.handleSubmit,
          handleOpenModal,
          handleCloseModal,
        }
      }
      modalIsOpen={modalIsOpen}
      tippyVisible={tippyVisible}
    />
  );
};

export default ForgetPassContainer;
