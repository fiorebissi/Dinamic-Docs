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
				templatedSelected.data.variables.forEach((variable, index) => {
					const { key, name } = variable
					switch (index) {
					case 0:
						keys = { ...keys, '{{city}}': document.getElementById(`${index}${name}`).innerText }
						break
					case 1:
						keys = { ...keys, '{{firstName}}': document.getElementById(`${index}${name}`).innerText }
						break
					case 2:
						keys = { ...keys, '{{lastName}}': document.getElementById(`${index}${name}`).innerText }
						break
					case 3:
						keys = { ...keys, '{{gender}}': document.getElementById(`${index}${name}`).innerText }
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
									document.querySelector(`#buttonSend${index}`).removeAttribute('disabled')
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
		let flag = false
		let indexRow
		let count = 0
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
		flag = rowSelected.current.filter((row, index) => {
			indexRow = index
			count++
			return row === id
		})
		console.log(count)
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
			<div className='lg:grid lg:grid-cols-2 lg:gap-4 relative'>
				{step === 1 && (
					<div className='absolute z-10 bg-black opacity-75 top-0 left-0 w-full h-full rounded transform scale-105 pb-8' />
				)}
				<Template setMailingSelected={setMailingSelected} setTemplatedSelected={setTemplatedSelected} templates={{ ...templates, step }} />
				{templatedSelected && (
					<div className='bg-white w-full h-full flex flex-col justify-center items-center animated fadeIn'>
						<FileDD templatedSelected={templatedSelected} setDataDOM={setDataDOM} setStep={setStep} setDataMailing={setDataMailing} />
						{dataDOM && (
							<div className='max-w-full'>
								<div>
									<p className='text-right font-bold'>{`Cantidad de Registros Cargados: ${dataDOM.body.count}`}</p>
								</div>
								<div className='p-1'>
									<p className="text-gray-600 italic">Selecione a quienes le quiere generar los documentos dinamicos y luego podra enviarlos por sms o por mail</p>
								</div>
								<div className='overflow-x-auto'>
									<table className='border-dotted border-4 border-blue-600 border-opacity-75 rounded-lg shadow-xl pt-8'>
										<thead>
											<tr>
												<th>
													<label className='flex flex-col py-2 px-1' htmlFor='allCheckbox'>
                            Seleccionar
														<input id='allCheckbox' onChange={selectAll} className='leading-tight' type='checkbox' />
													</label>
												</th>
												<th>Genero</th>
												<th>Nombre</th>
												<th>Apellido</th>
												<th>Ciudad</th>
												<th className='font-bold'>Enviar</th>
											</tr>
										</thead>
										<tbody>
											{dataDOM.body.list_user.map((data, index) => {
												const { firstName, lastName, email, enterprise } = data
												const id = index
												return (
													<tr className='text-center text-sm' key={id}>
														<td className='border p-1'>
															<div className='flex justify-center items-center h-full w-full'>
																<input className='leading-tight mt-1 checkboxDownload' type='checkbox' />
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
																<td key={`${keyIndex}${name}`} className='border p-1' id={`${keyIndex}${name}`}>{tdText}</td>
															)
														})}
														<td className='border p-1 flax justify-center items-center'>
															<button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-blue-200' id={`buttonSend${id}`} type='button' onClick={() => console.log('keloke')} disabled={true}>Enviar</button>
														</td>
													</tr>
												)
											})}
										</tbody>
									</table>
								</div>
								<div className='flex p-4 space-x-4'>
									<button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded' type='button' onClick={() => handleDownload()}>Generar Seleccionados</button>
								</div>
							</div>
						)/* : dataDOM && <div><p>{`La cantidad de registros es: ${dataDOM.body.count}`}</p></div> */}
					</div>
				)}
			</div>
			{dataMailing.send && step === 1 && (
				<div className='pb-12'>
					<div className='text-center py-12'>
						<button type='button' onClick={reset} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Volver al paso anterior</button>
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
