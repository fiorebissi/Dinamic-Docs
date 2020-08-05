import React from 'react'
import { Link } from 'react-router-dom'
import homeLeft from '../assets/static/drawHomeLeft.svg'
import homeRight from '../assets/static/drawHomeRight.svg'
import drawAcuerdo from '../assets/static/drawAcuerdo.svg'
import drawDD from '../assets/static/drawDD.svg'
import ButtonMenu from '../components/home/ButtonMenu'

const Index = () => {
	return (
		<main className='flex justify-center w-full h-full bg-white animated fadeIn'>
			<div className='container'>
				<div className='grid w-full h-full grid-cols-2 p-5 mt-4 divide-x-4 divide-black'>
					<ButtonMenu href='/home/documentosDinamicos/fileForm' src={drawDD}>Documentos Dinamico</ButtonMenu>
					<ButtonMenu href='/home/Pdfs' src={drawAcuerdo}>Firma Digial a PDF</ButtonMenu>
					{/*<Link to='/home/documentosDinamicos/fileForm' className='w-full h-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700'>
						<img className='object-contain' src={homeLeft} alt='' />
						Documentos Dinamicos
					</Link>
					<Link to='/home/Pdfs' className='w-full h-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700'>
					<img className='object-contain' src={homeRight} alt='' />
						Pdfs
					</Link>*/}
				</div>
			</div>
		</main>
	)
}

export default Index
