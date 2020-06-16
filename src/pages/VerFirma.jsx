import React, { useRef, useState, useEffect } from 'react'
import { Document, Page } from 'react-pdf/dist/entry.webpack'
import LoaderDualRing from '../components/LoaderDualRing'
import arrow from '../assets/static/arrow.svg'
import download from '../assets/static/download.svg'
import { deviceIs } from '../funciones'

const VerFirma = () => {
	const [numPages, setNumPages] = useState(null)
	const [pageNumber, setPageNumber] = useState(1)
	const canvasSize = useRef({
		height: 0,
		width: 0
	})

	function onDocumentLoadSuccess ({ numPages }) {
		setNumPages(numPages)
		setPageNumber(numPages)
	}

	return (
		<div className='animated fadeIn py-4'>
			<h1 className='text-center font-bold text-xl text-gray-700 py-2'>Su Documento: </h1>
			{ deviceIs() === 'desktop' && (
				<div className='text-center py-4 hidden lg:block'>
					<a id='link' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' download='suPoliza.pdf' href={`data:application/pdf;base64,${localStorage.getItem('verFirma')}`} title='Download pdf document'>
            Descargar
						<img className='object-contain w-4 inline ml-2' src={download} alt='arrow' />
					</a>
				</div>
			)}
			<div className='flex flex-col justify-center items-center'>
				<p className='text-center text-gray-700 font-bold text-lg'>
					{`Pagina ${pageNumber} de ${numPages}`}
				</p>
				<div className='flex justify-around'>
					<div className={`flex items-center ${pageNumber <= 1 && 'invisible'}`}>
						<button type='button' onClick={() => setPageNumber(pageNumber - 1)} className='w-8 h-8'>
							<img className='object-contain' src={arrow} alt='Atras' />
						</button>
					</div>
					<div id='ResumeContainer'>
						<Document
							className='PDFDocument'
							file={`data:application/pdf;base64,${localStorage.getItem('verFirma')}`}
							onLoadSuccess={onDocumentLoadSuccess}
							error={<p className='text-lg text-red-700'>Error al mostrar el PDF</p>}
							loading={<LoaderDualRing />}
							noData={<LoaderDualRing />}
						>
							<Page
								onLoadSuccess={(page) => {
									if (page.pageNumber === 1) {
										canvasSize.current = {
											height: document.querySelector('.react-pdf__Page__canvas').offsetHeight,
											width: document.querySelector('.react-pdf__Page__canvas').offsetWidth
										}
									}
								}}
								onRenderSuccess={() => window.scrollTo(0, document.body.scrollHeight)}
								pageNumber={pageNumber}
								className='PDFPage'
								renderTextLayer={false}
								scale={2.5}
								loading={<div className='flex items-center justify-center' style={{ height: `${canvasSize.current.height}px`, width: `${canvasSize.current.width}px` }}><LoaderDualRing /></div>}
							/>
						</Document>
					</div>
					<div className={`flex items-center ${pageNumber >= numPages && 'invisible'}`}>
						<button type='button' onClick={() => setPageNumber(pageNumber + 1)} className='w-8 h-8 rotate-180 transform'>
							<img className='object-contain' src={arrow} alt='Atras' />
						</button>
					</div>
				</div>
				<p className='text-center text-gray-700 font-bold text-lg'>
					{`Pagina ${pageNumber} de ${numPages}`}
				</p>
			</div>
			{ deviceIs() === 'mobile' && (
				<div className='text-center py-4 lg:hidden'>
					<a id='link' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' download='suPoliza.pdf' href={`data:application/pdf;base64,${localStorage.getItem('verFirma')}`} title='Download pdf document'>
            Descargar
						<img className='object-contain w-4 inline ml-2' src={download} alt='arrow' />
					</a>
				</div>
			)}
		</div>
	)
}

export default VerFirma
