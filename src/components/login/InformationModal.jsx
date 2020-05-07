import React from 'react';
import Modal from '../Modal';

const InformationModal = ({ children, isOpen, onCloseModal }) => {
  return (
    <Modal isOpen={isOpen} onClose={onCloseModal}>
      <div className='text-black text-center'>
        <div className='text-2xl mb-2'>
          <h3>Información</h3>
        </div>
        <div className='my-2'>
          <p className='p-2 bg-blue-300 rounded-lg'>{children}</p>
        </div>
        <div className='flex w-full justify-end mt-6'>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded' type='button' onClick={onCloseModal}>¡Entendido!</button>
        </div>
      </div>
    </Modal>
  );
};

export default InformationModal;
