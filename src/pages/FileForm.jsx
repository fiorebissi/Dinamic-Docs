import React, { useState, useRef } from 'react'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import Template from '../components/Template'
import { deviceIs } from '../funciones'
import FileDD from '../components/FileDD'
import Send from '../components/Send'
import LoaderDualRing from '../components/LoaderDualRing'
import sendMailSMS from '../sendMailSMS'
import sms from '../assets/static/sms.svg'
import email from '../assets/static/email.svg'

const FileForm = ({ templates }) => {
	const [dataDOM, setDataDOM] = useState(null)
	const [dataMailing, setDataMailing] = useState({
		send: false,
		firstName: '',
		lastName: ''
	})
	const [step, setStep] = useState(0)
	const [templatedSelected, setTemplatedSelected] = useState(null)
	const [mailingSelected, setMailingSelected] = useState(null)
	const dataGenerated = useRef(null)
	const rowSelected = useRef([])

	const reset = () => {
		setStep(0)
		setTemplatedSelected(null)
		setMailingSelected(null)
		setDataMailing({
			send: false,
			firstName: '',
			lastName: ''
		})
	}

	const handleDownload = () => {
		rowSelected.current = []
		const data = []
		let keys = {
			'{{city}}': '',
			'{{firstName}}': '',
			'{{gender}}': '',
			'{{lastName}}': ''
		}
		document.querySelectorAll('.checkboxDownload').forEach((checkbox, index) => {
			const input = checkbox
			if (input.checked === true) {
				templatedSelected.data.variables.forEach((variable, i) => {
					const { key, name } = variable
					const generoDOM = document.getElementById(`${index}${name}`).innerText.toLowerCase()
					let genero = 'o'
					switch (i) {
					case 0:
						if (generoDOM === 'masculino' || generoDOM === 'm' || generoDOM === 'o') {
							genero = 'o'
						}
						if (generoDOM === 'femenino' || generoDOM === 'f' || generoDOM === 'a') {
							genero = 'a'
						}
						keys = { ...keys, '{{firstName}}': document.getElementById(`${index}${name}`).innerText }
						break
					case 1:
						keys = { ...keys, '{{lastName}}': document.getElementById(`${index}${name}`).innerText }
						break
					case 2:
						keys = { ...keys, '{{gender}}': genero }
						break
					case 3:
						keys = { ...keys, '{{city}}': document.getElementById(`${index}${name}`).innerText }
						break
					default:
						break
					}
				})

				data.push({ variables: keys })
			}
		})
		const miInit = {
			method: 'POST',
			body: JSON.stringify({
				name_template: templatedSelected.data.name,
				records: data
			}),
			headers: {
				'Content-Type': 'application/json'
			}
			// credentials: 'include',
		}
		const MySwal = withReactContent(Swal)
		MySwal.fire({
			title: 'Enviando Información...',
			html: (
				<LoaderDualRing />
			),
			showConfirmButton: false,
			allowOutsideClick: false,
			onRender: () => {
				fetch('http://www.rchdynamic.com.ar/dd/document/', miInit)
				// fetch('http://localhost:3000/dd/document/create/excel', miInit)
					.then((response) => {
						return response.json()
					})
					.catch((error) => {
						console.log(error)
						return { type: 'error' }
					})
					.then((response) => {
						let linkPreview
						let body
						console.log(response)
						if (response.type === 'error') {
							Swal.fire(
								'Ramon Chozas S.A',
								response.message,
								'error'
							)
						} else {
							linkPreview = response.body[0].url
							body = response.body
							Swal.fire('Ramon Chozas S.A', response.message, 'success')
							document.querySelectorAll('.checkboxDownload').forEach((checkbox, index) => {
								const input = checkbox
								if (input.checked === true) {
									rowSelected.current.push(index)
									// document.querySelector(`#buttonSend${index}`).removeAttribute('disabled')
									// document.querySelector(`#buttonSend${index}`).addEventListener('click', () => { goToNextStep(index) })
								}
							})
							dataGenerated.current = response
							nextStep(linkPreview, body)
							/* if (response.body.length >= 2) {
								dataGenerated.current = response
							} else {
								const url = `data:text/html;base64,${response.body.base64}`
								const a = document.createElement('a')
								a.href = url
								a.download = 'filename.html'
								document.body.appendChild(a) // we need to append the element to the dom -> otherwise it will not work in firefox
								a.click()
								a.remove() // afterwards we remove the element again
							} */
						}
					})
			}
		})
	}

	const nextStep = (linkPreview, bodyGenerated) => {
		const MySwal = withReactContent(Swal)
		MySwal.fire({
			title: '¿Que desea hacer?',
			html: (
				<div className='p-2'>
					<div className='pb-4'>
						<a href={linkPreview} target='_blank' className='px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700'>Ver Preview</a>
					</div>
					<div className='grid grid-cols-2 row-gap-2 col-gap-4'>
						<p className='col-span-2 font-bold'>Enviar por:</p>
						<div className='flex justify-end'>
							<button className='p-2 text-center bg-blue-300 rounded hover:bg-blue-200' type='button' onClick={() => sendManyMails(bodyGenerated)}>
								<div className='w-20 h-20'>
									<img className='object-contain' src={email} alt='' />
								</div>
								<p className='font-semibold'>Mail</p>
							</button>
						</div>
						<div className='flex justify-start'>
							<button className='p-2 text-center bg-blue-300 rounded hover:bg-blue-200' type='button' onClick={() => sendManySms(bodyGenerated)}>
								<div className='w-20 h-20'>
									<img className='object-contain' src={sms} alt='' />
								</div>
								<p className='font-semibold'>SMS</p>
							</button>
						</div>
					</div>
				</div>
			),
			showConfirmButton: false,
			allowOutsideClick: false
		})
	}

	const sendManyMails = (bodyGenerated) => {
		const MySwal = withReactContent(Swal)
		const result = preparingSendMail(bodyGenerated)
		console.log(result)
		MySwal.fire({
			title: 'Preparando mailing',
			html: (
				<LoaderDualRing />
			),
			showConfirmButton: false,
			allowOutsideClick: false,
			onRender: () => {
				fetch('http://www.rchdynamic.com.ar/dd/mailing/create-and-send-addDocument', {
					method: 'POST',
					body: JSON.stringify({
						name_template: 'campaña_dd',
						records: result
					}),
					headers: {
						'Content-Type': 'application/json'
					}
				})
					.then((response) => {
						return response.json()
					})
					.catch((error) => {
						console.log(error)
						return { type: 'error' }
					})
					.then((response) => {
						console.log(response)
						if (response.type === 'error') {
							Swal.fire(
								'Ramon Chozas S.A',
								response.message,
								'error'
							)
						} else {
							Swal.fire('Ramon Chozas S.A', 'Se comenzó el envío de mails', 'success')
						}
					})
			}
		})
	}

	const sendManySms = (bodyGenerated) => {
		const MySwal = withReactContent(Swal)
		MySwal.fire({
			title: 'Enviando SMS...',
			html: (
				<LoaderDualRing />
			),
			showConfirmButton: false,
			allowOutsideClick: false,
			onRender: () => {
				const result = preparingSendSms(bodyGenerated)
				console.log(result)
				fetch('http://www.rchdynamic.com.ar/dd/document/send-many-sms', {
					method: 'POST',
					body: JSON.stringify({
						records: result
					}),
					headers: {
						'Content-Type': 'application/json'
					}
				}).then((response) => {
					return response.json()
				})
					.catch((error) => {
						console.log(error)
						return { type: 'error' }
					})
					.then((response) => {
						console.log(response)
						if (response.type === 'error') {
							Swal.fire(
								'Ramon Chozas S.A',
								response.message,
								'error'
							)
						} else {
							Swal.fire('Ramon Chozas S.A', 'Mensajes Enviados con exito', 'success')
						}
					})
			}
		})
	}

	const preparingSendMail = (bodyGenerated) => {
		bodyGenerated.forEach(function (object) { delete object.url })
		const email = dataDOM.body.list_user.map((user) => {
			return user.email
		})
		const result = bodyGenerated.map((object, index) => {
			return { ...object, to: email[index] }
		})
		return result
	}

	const preparingSendSms = (bodyGenerated) => {
		bodyGenerated.forEach(function (object) { delete object.url })
		const phones = dataDOM.body.list_user.map((user) => {
			return user.telefono
		})
		const result = bodyGenerated.map((object, index) => {
			return { ...object, phone: phones[index] }
		})
		return result
	}

	const goToNextStep = (id) => {
		let keys = {
			'{{city}}': '',
			'{{firstName}}': '',
			'{{gender}}': '',
			'{{lastName}}': ''
		}
		let indexRow
		let data
		templatedSelected.data.variables.forEach((variable, index) => {
			const { key, name } = variable
			switch (index) {
			case 0:
				keys = { ...keys, '{{firstName}}': document.getElementById(`${id}${name}`).innerText }
				break
			case 1:
				keys = { ...keys, '{{lastName}}': document.getElementById(`${id}${name}`).innerText }
				break
			case 2:
				keys = { ...keys, '{{gender}}': document.getElementById(`${id}${name}`).innerText }
				break
			case 3:
				keys = { ...keys, '{{city}}': document.getElementById(`${id}${name}`).innerText }
				break
			default:
				break
			}
		})
		rowSelected.current.filter((row, index) => {
			indexRow = index
			return row === id
		})
		if (Array.isArray(dataGenerated.current.body)) {
			data = dataGenerated.current.body[indexRow]
		} else {
			data = dataGenerated.current.body
		}
		console.log(data)
		sendMailSMS(data, setStep, keys, setDataMailing)
	}

	const selectAll = (e) => {
		if (e.currentTarget.checked) {
			document.querySelectorAll('.checkboxDownload').forEach((checkbox) => {
				const input = checkbox
				input.checked = true
			})
		} else {
			document.querySelectorAll('.checkboxDownload').forEach((checkbox) => {
				const input = checkbox
				input.checked = false
			})
		}
	}

	return (
		<main>
			<div className='relative lg:grid lg:grid-cols-2 lg:gap-4'>
				{step === 1 && (
					<div className='absolute top-0 left-0 z-10 w-full h-full pb-8 transform scale-105 bg-black rounded opacity-75' />
				)}
				<Template setMailingSelected={setMailingSelected} setTemplatedSelected={setTemplatedSelected} templates={{ ...templates, step }} />
				{templatedSelected && (
					<div className='flex flex-col items-center justify-center w-full h-full bg-white animated fadeIn'>
						<FileDD templatedSelected={templatedSelected} setDataDOM={setDataDOM} setStep={setStep} setDataMailing={setDataMailing} />
						{dataDOM && (
							<div className='max-w-full'>
								<div>
									<p className='font-bold text-right'>{`Cantidad de Registros Cargados: ${dataDOM.body.count}`}</p>
								</div>
								<div className='overflow-x-auto'>
									<table className='pt-8 border-4 border-blue-600 border-opacity-75 border-dotted rounded-lg shadow-xl'>
										<thead>
											<tr>
												<th className='hidden'>
													<label className='flex flex-col px-1 py-2' htmlFor='allCheckbox'>
                            Seleccionar
														<input id='allCheckbox' onChange={selectAll} className='leading-tight' type='checkbox' defaultChecked={true} />
													</label>
												</th>
												<th>Nombre</th>
												<th>Apellido</th>
												<th>Genero</th>
												<th>Ciudad</th>
												<th>Telefono</th>
												<th>Email</th>
											</tr>
										</thead>
										<tbody>
											{dataDOM.body.list_user.map((data, index) => {
												const { nombre, apellido, genero, ciudad, telefono, email } = data
												const id = index
												return (
													<tr className='text-sm text-center' key={id}>
														<td className='hidden p-1 border'>
															<div className='flex items-center justify-center w-full h-full'>
																<input className='mt-1 leading-tight checkboxDownload' type='checkbox' defaultChecked={true} />
															</div>
														</td>
														{ templatedSelected.data.variables.map((variable, i) => {
															const { id, name } = variable
															let tdText = ''
															const keyIndex = index
															switch (i) {
															case 0:
																tdText = nombre
																break
															case 1:
																tdText = apellido
																break
															case 2:
																tdText = genero
																break
															case 3:
																tdText = ciudad
																break
															case 4:
																tdText = telefono
																break
															case 5:
																tdText = email
																break
															}
															return (
																<td key={`${keyIndex}${name}`} className='p-1 border' id={`${keyIndex}${name}`}>{tdText}</td>
															)
														})}
													</tr>
												)
											})}
										</tbody>
									</table>
								</div>
								<div className='flex p-4 space-x-4'>
									<button className='px-2 py-1 font-bold text-white bg-blue-500 rounded hover:bg-blue-700' type='button' onClick={() => handleDownload()}>Generar</button>
								</div>
							</div>
						)/* : dataDOM && <div><p>{`La cantidad de registros es: ${dataDOM.body.count}`}</p></div> */}
					</div>
				)}
			</div>
			{dataMailing.send && step === 1 && (
				<div className='pb-12'>
					<div className='py-12 text-center'>
						<button type='button' onClick={reset} className='px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700'>Volver al paso anterior</button>
					</div>
					<div className='lg:grid lg:grid-cols-2'>
						{ deviceIs() === 'desktop' && <Template setMailingSelected={setMailingSelected} setTemplatedSelected={setTemplatedSelected} templates={{ ...templates, step }} /> }
						{mailingSelected && mailingSelected.data && mailingSelected.data.type !== 'document' &&
            <Send mailingSelected={mailingSelected.data} dataMailing={dataMailing} />}
					</div>
				</div>
			)}
		</main>

	)
}

export default FileForm
