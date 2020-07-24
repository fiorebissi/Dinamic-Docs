import { PdfController } from '../controller/PdfController'

export const routesPdf = [
	{
		method: 'post',
		route: '/pdf/htmlToPdf',
		controller: PdfController,
		action: 'createHtmlToPdf'
	},
	{
		method: 'post',
		route: '/pdf/pdfToPdf',
		controller: PdfController,
		action: 'setTextInPdf'
	},
	{
		method: 'post',
		route: '/pdf/sign',
		controller: PdfController,
		action: 'setPngInPdf'
	},
	{
		method: 'get',
		route: '/pdf/encrypted/:encrypted/:id',
		controller: PdfController,
		action: 'readEncrypted'
	}
]
