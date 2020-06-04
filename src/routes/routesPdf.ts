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
    route: '/pdf/:id',
    controller: PdfController,
    action: 'read'
  },
  {
    method: 'get',
    route: '/pdf/encrypt/:encrypted_id',
    controller: PdfController,
    action: 'readEncrypt'
  }
]
