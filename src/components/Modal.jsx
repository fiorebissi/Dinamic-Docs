import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../assets/styles/modal.css';
import cross from '../assets/static/cross.svg';

const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }
  useEffect(() => {
    document.querySelector('.Modal').addEventListener('click', (e) => {
      if (e.target === document.querySelector('.Modal')) {
        onClose();
      }
    });
  }, []);
  return ReactDOM.createPortal(
    <div className='Modal animated fadeIn faster z-30'>
      <div className='Modal__container animated slideInDown faster rounded-lg overflow-auto'>
        <button className='Modal__close-button z-10 m-2' type='button' onClick={() => { onClose(); }}>
          <img className='object-contain h-4 w-4' src={cross} alt='close' />
        </button>
        {children}
      </div>
    </div>,
    document.getElementById('modal'),
  );
};

export default Modal;
