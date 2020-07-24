import React, { useState, useRef } from 'react'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import Template from '../components/Template'
import { deviceIs } from '../funciones'
import FileDD from '../components/FileDD'
import Send from '../components/Send'
import LoaderDualRing from '../components/LoaderDualRing'
import sendMailSMS from '../sendMailSMS'

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
					switch (i) {
					case 0:
						let genero = document.getElementById(`${index}${name}`).innerText.toLowerCase();
						if (genero === 'masculino' || genero === 'm' || genero === 'o') {
							genero = 'o'
						}
						if (genero === 'femenino' || genero === 'f' || genero === 'a') {
							genero = 'a'
						}
						keys = { ...keys, '{{gender}}': genero }
						break
					case 1:
						keys = { ...keys, '{{firstName}}': document.getElementById(`${index}${name}`).innerText }
						break
					case 2:
						keys = { ...keys, '{{lastName}}': document.getElementById(`${index}${name}`).innerText }
						break
					case 3:
						keys = { ...keys, '{{city}}': document.getElementById(`${index}${name}`).innerText }
						break
					default:
						break
					}
				})

				data.push({ ...keys })
			}
		})
		const miInit = {
			method: 'POST',
			body: JSON.stringify({
				name_template: templatedSelected.data.name,
				data: data
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
						console.log(response)
						if (response.type === 'error') {
							Swal.fire(
								'Ramon Chozas S.A',
								response.message,
								'error'
							)
						} else {
							Swal.fire('Ramon Chozas S.A', response.message, 'success')
							document.querySelectorAll('.checkboxDownload').forEach((checkbox, index) => {
								const input = checkbox
								if (input.checked === true) {
									rowSelected.current.push(index)
									//document.querySelector(`#buttonSend${index}`).removeAttribute('disabled')
									document.querySelector(`#buttonSend${index}`).addEventListener('click', () => { goToNextStep(index) })
								}
							})
							dataGenerated.current = response
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
				keys = { ...keys, '{{city}}': document.getElementById(`${id}${name}`).innerText }
				break
			case 1:
				keys = { ...keys, '{{firstName}}': document.getElementById(`${id}${name}`).innerText }
				break
			case 2:
				keys = { ...keys, '{{gender}}': document.getElementById(`${id}${name}`).innerText }
				break
			case 3:
				keys = { ...keys, '{{lastName}}': document.getElementById(`${id}${name}`).innerText }
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
												<th>Genero</th>
												<th>Nombre</th>
												<th>Apellido</th>
												<th>Ciudad</th>
											</tr>
										</thead>
										<tbody>
											{dataDOM.body.list_user.map((data, index) => {
												const { firstName, lastName, email, enterprise } = data
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
																tdText = firstName
																break
															case 1:
																tdText = lastName
																break
															case 2:
																tdText = email
																break
															case 3:
																tdText = enterprise
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
									<button className='px-2 py-1 font-bold text-white bg-blue-500 rounded hover:bg-blue-700' type='button' onClick={() => handleDownload()}>Preparar envio</button>
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
