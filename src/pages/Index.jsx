import React from 'react'
import { Link } from 'react-router-dom'

const Index = () => {
	return (
		<main className='w-full h-full bg-white animated fadeIn'>
			<div className='flex flex-col items-center justify-center w-full h-full p-5 mt-4 sm:mt-12 md:mt-24 lg:mt-48 xl:mt-64'>
				<Link to='/home/documentosDinamicos/fileForm' className='px-4 py-2 m-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700'>
          Documentos Dinamicos
				</Link>
				<Link to='/home/Pdfs' className='px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700'>
          Pdfs
				</Link>
			</div>
		</main>
	)
}

export default Index
