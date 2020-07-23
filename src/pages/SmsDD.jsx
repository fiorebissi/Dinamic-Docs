import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import tick from '../assets/static/tick.svg'

const SmsDD = () => {
	const { hash, id } = useParams()
	useEffect(() => {
		fetch(`http://www.rchdynamic.com.ar/dd/document/encrypted/${hash}/${id}`)
			.then((response) => {
				return response.json()
			})
			.catch((error) => {
				// Swal.fire('Error al traer el PDF para firmar', 'error', 'error');
				console.log(error)
			})
			.then((response) => {
				console.log(response)
				const url = `data:text/html;base64,${response.body.base64}`
				const a = document.createElement('a')
				a.href = url
				a.download = 'filename.html'
				document.body.appendChild(a) // we need to append the element to the dom -> otherwise it will not work in firefox
				a.click()
				a.remove() // afterwards we remove the element again
			})
	}, [])
	return (
		<div className='pt-12 flex justify-center items-center'>
			<div className='rounded border border-black shadow bg-black bg-opacity-75 p-4'>
				<div className='flex items-center justify-center'>
					<img className='object-contain w-12' src={tick} alt='perfecto' />
				</div>
				<h1 className='font-bold text-white pt-2 text-xl text-center'>¡Descargado con Exito!</h1>
			</div>
		</div>
	)
}

export default SmsDD
