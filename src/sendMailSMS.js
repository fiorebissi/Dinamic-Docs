import React from 'react'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'

const sendMailSMS = (dataDD, setStep, dataSend, setDataMailing) => {
	const MySwal = withReactContent(Swal)
	let resolve
	MySwal.fire({
		icon: 'question',
		title: '¿Le gustaría enviarlo por mail o SMS?',
		showConfirmButton: false,
		html: (
			<div className='grid grid-cols-3 gap-4'>
				<button onClick={() => MySwal.close() } className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded' type='button'>Cancelar</button>
				<button onClick={() => { resolve = { isConfirmed: true, is: 'mail' }; MySwal.close() }} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' type='button'>Enviar Mail</button>
				<button onClick={() => { resolve = { isConfirmed: true, is: 'sms' }; MySwal.close() }} className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded' type='button'>Enviar SMS</button>
			</div>),
		allowOutsideClick: false
	}).then(() => {
		console.log(resolve)
		console.log(dataDD)
		if (resolve) {
			if (resolve.is === 'mail') {
				setStep(1)
				setDataMailing({
					send: true,
					...dataSend,
					document_id: dataDD.id
				})
			} else {
				Swal.fire({
					title: 'Ingrese numero de telefono',
					input: 'number',
					confirmButtonText: 'Enviar',
					showLoaderOnConfirm: true,
					preConfirm: (phone) => {
						return fetch('http://www.rchdynamic.com.ar/dd/document/send-sms/', {
							method: 'POST',
							body: JSON.stringify({
								id: dataDD.id,
								phone,
								encrypted: dataDD.encrypted
							}),
							headers: {
								'Content-Type': 'application/json'
							}
							// credentials: 'include',
						})
							.then(response => {
								if (!response.ok) {
									throw new Error(response.statusText)
								}
								return response.json()
							})
							.catch(error => {
								console.log(error)
								Swal.showValidationMessage(
									`Error al enviar SMS: ${error}`
								)
								return { type: 'error' }
							})
					},
					allowOutsideClick: () => !Swal.isLoading()
				}).then((result) => {
					console.log(result)
					if (result.value.type === 'success') {
						Swal.fire('Ramon Chozas S.A', result.value.message, 'success')
					} else {
						Swal.fire('Error al enviar SMS', result.value.message, 'error')
					}
				})
			}
		}
	})
}

export default sendMailSMS
