import React, { useEffect, useState, useRef } from 'react'
import '../assets/styles/template.css'
import LoaderDualRing from './LoaderDualRing'
import { deviceIs } from '../funciones'

const Template = ({ templates, setTemplatedSelected, setMailingSelected }) => {
	const [dataTemplates, setDataTemplates] = useState(null)
	const step = useRef(templates.step)
	const handleClick = (e) => {
		document.querySelectorAll(`.buttonTemplate${dataTemplates.type}`).forEach((button, i) => {
			if (button.classList.contains('scale-110')) {
				button.classList.remove('scale-110', 'border-gray-500')
				button.classList.replace('border-gray-500', 'border-gray-900')
			}
		})
		e.currentTarget.classList.add('scale-110')
		e.currentTarget.classList.replace('border-gray-900', 'border-gray-500')
		const arrayDataSend = e.currentTarget.id.split('-')
		switch (step.current) {
		case 0:
			setTemplatedSelected({ data: templates.body.list_html[arrayDataSend[1]] })
			break
		case 1:
			setMailingSelected({ data: templates.body.list_mailing[arrayDataSend[1]] })
			break
		}
	}

	useEffect(() => {
		switch (step.current) {
		case 0:
			setDataTemplates({ data: templates.body.list_html })
			break
		case 1:
			setDataTemplates({ data: templates.body.list_mailing })
			break
		}
	}, [templates])

	return (
		<main className='w-full h-full flex flex-col'>
			<h1 className='text-blue-600 text-2xl font-bold text-center'>Seleccione un Template:</h1>
			<div className='pt-4'>
				{ !templates.state ? <LoaderDualRing /> : templates.type !== 'success'
					? (
						<div>
							<h1 className='text-center text-xl text-red-700 font-bold'>¡Error!</h1>
						</div>
					) : dataTemplates && dataTemplates.data && dataTemplates.data.lenght <= 0 ? (
						<div>
							<h1 className='text-center text-xl text-red-700 font-bold'>No hay templates cargados</h1>
						</div>
					) : dataTemplates && dataTemplates.data && (
						<div className='flex flex-col md:grid md:grid-cols-3 md:gap-4 pb-8'>
							{dataTemplates.data.map((template, index) => {
								const { id, image, name } = template
								return (
									<div className='w-full py-2 px-8 md:w-auto md:p-0' key={name}>
										<button id={`${name}-${index}`} type='button' onClick={(e) => handleClick(e)} className={`buttonTemplate${dataTemplates.type} h-full w-full bg-blue-600 md:bg-white md:w-auto border-gray-900 hover:border-gray-500 hover:scale-110 duration-200 border-2 transform rounded cursor-pointer text-white py-2 md:py-0`}>
											{deviceIs() === 'mobile' ? <p className='capitalize'>{name}</p> : <img className='object-contain' src={image} alt={name} />}
										</button>
									</div>
								)
							})}
						</div>
					)}
			</div>
		</main>
	)
}

export default Template
