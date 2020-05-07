import React from 'react';
import Modal from '../Modal';

const ExitModal = ({ children, isOpen, onCloseModal, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onCloseModal}>
      <div className='text-black'>
        <div className='text-center text-2xl'>
          <h3>{children}</h3>
        </div>
        <div className='flex w-full justify-around mt-6'>
          <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 border border-red-700 rounded' type='button' onClick={onCloseModal}>Cancelar</button>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded' type='button' onClick={onConfirm}>Confirmar</button>
        </div>
      </div>
    </Modal>
  );
};

export default ExitModal;
