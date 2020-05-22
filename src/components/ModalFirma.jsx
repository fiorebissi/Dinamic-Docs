import React, { useEffect } from 'react'
import Swal from 'sweetalert2'
import { viewportOrientation } from '../funciones'
import Modal from './Modal'
import Firmar from './Firmar'

const ModalFirma = ({setIsOpen, isOpen, handleCloseModal, confirm}) => {
  if (isOpen === false) {
    return null
  }
  useEffect(() => {
    window.onresize = () =>{
      if (viewportOrientation() === 'portrait') {
        Swal.fire({
          title: 'Debe poner su dispositivo de forma horizontal',
          icon: 'error',
          onDestroy: () => {
            setIsOpen(false)
          }
        })
      }
    }
  }, [])
  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal}>
      <div className='h-screen-90 w-screen'>
        <div className='p-4 w-full h-full'>
          <Firmar position='horizontally' confirm={confirm} />
        </div>
      </div>
    </Modal>
  )
}

export default ModalFirma
