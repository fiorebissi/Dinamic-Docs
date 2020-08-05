import React, { useRef } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import LoaderDualRing from './LoaderDualRing'
import LabelInput from './LabelInput'
import sendMailSMS from '../sendMailSMS'

const FormDD = ({ setDataMailing, setStep, templatedSelected }) => {
	const dataSend = useRef([])

	const petition = () => {
		templatedSelected.data.variables.forEach((variable) => {
			const { key, name } = variable
			dataSend.current[`${key}`] = document.querySelector(`#${name}`).value
		})
		const data = dataSend.current
		console.log(data)
		const header = {
			method: 'POST',
			body: JSON.stringify({
				name_template: templatedSelected.data.name,
				records: [{
					...data
				}]
			}),
			headers: {
				'Content-Type': 'application/json'
			}
			// credentials: 'include',
		}

		return fetch('http://www.rchdynamic.com.ar/dd/document/', header)
			.then((response) => {
				return response.json()
			})
			.catch((error) => {
				Swal.fire('Ramon Chozas S.A', error, 'error')
				console.log(error)
				return { type: 'error' }
			})
			.then((response) => {
				Swal.fire('Ramon Chozas S.A', response.message, 'success')
				console.log(response)
				return response
			})
	}

	const handleSend = (e) => {
		e.preventDefault()
		const MySwal = withReactContent(Swal)
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
						console.log(response)
						console.log(response.type)
						if (response.type === 'error') {
							Swal.fire('Error al generar el Documento Dinamico', response.message, 'error')
						} else {
							Swal.fire('Ramon Chozas S.A', response.message, 'success').then(() => {
								/* const url = `data:text/html;base64,${response.body.base64}`
								const a = document.createElement('a')
								a.href = url
								a.download = 'filename.html'
								document.body.appendChild(a) // we need to append the element to the dom -> otherwise it will not work in firefox
								a.click()
								a.remove() // afterwards we remove the element again */
							}).then(() => {
								sendMailSMS(response.body, setStep, dataSend.current, setDataMailing)
							})
						}
					})
			}
		})
	}

	return (
		<main className='flex flex-col items-center justify-center w-full h-full min-w-full min-h-full animated fadeIn'>
			<h1 className='text-xl font-bold text-gray-700 capitalize'>{templatedSelected.data.name}</h1>
			<form onSubmit={(e) => handleSend(e)} className='px-8 pt-6 pb-8 mb-4 space-y-4 bg-white rounded shadow-md'>
				{templatedSelected.data && templatedSelected.data.variables.map((variable, index) => {
					const { id, key, name, type } = variable
					if (type === 'select') {
						return (
							<select id={name} key={key} className="block w-full px-4 py-3 pr-8 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500" required >
								<option value=''>---</option>
								<option value='o'>Masculino</option>
								<option value='a'>Femenino</option>
							</select>
						)
					}
					return (
						<LabelInput key={key} type={type} name={name} />
					)
				})}
				<div className='flex items-center justify-between'>
					<button className='px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline' type='submit'>
            Generar Documento Dinamico
					</button>
				</div>
			</form>
		</main>
	)
}

export default FormDD
