import React, { useEffect, useRef } from 'react'
import { fabric } from 'fabric'
import signDocument from '../assets/static/signDocument.png'
import arrow from '../assets/static/arrow.svg'

const Firmar = ({ position, confirm }) => {
	const canvas = useRef(false)

	const resizeCanvas = (canvas, render) => {
		canvas.setHeight(document.querySelector('.firmar').offsetHeight)
		canvas.setWidth(document.querySelector('.firmar').offsetWidth)
		if (render) {
			canvas.renderAll()
		}
	}

	useEffect(() => {
		canvas.current = new fabric.Canvas('canvas')
		canvas.current.backgroundColor = 'white'
		canvas.current.isDrawingMode = 1
		canvas.current.freeDrawingBrush.color = 'black'
		canvas.current.freeDrawingBrush.width = 8
		resizeCanvas(canvas.current)
		canvas.current.renderAll()
	}, [])

	const clear = () => {
		canvas.current.clear()
		canvas.current.renderAll()
	}

	return (
		<div className='firmar w-full h-full'>
			<img className='hidden' id='signImage' src={signDocument} alt='' />
			<canvas className={`border-2 border-black ${position === 'horizontally' && ''}`} id='canvas' />
			<div className={`text-right mt-1 ${confirm && 'flex justify-between'}`}>
				{confirm && <button className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded' type='button' onClick={confirm}>¡Confirmar!</button>}
				<div className='flex justify-center items-center flex-col'>
					<img className='transform rotate-90 object-contain w-6' src={arrow} alt='Firme arriba' />
					<p className='font-bold text-gray-700'>Firme aquí</p>
				</div>
				<button className='bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded' type='button' onClick={clear}>Limpiar</button>
			</div>
		</div>
	)
}

export default Firmar
