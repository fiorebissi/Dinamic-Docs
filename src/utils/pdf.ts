import fs from 'fs'
import puppeteer from 'puppeteer'
import { PDFDocument } from 'pdf-lib'
import { replaceAll } from './document'
// eslint-disable-next-line no-unused-vars
import { IDrawText, IPdfProperty, IDrawImg } from '../interface/IPdf'

export const createPdfToPdf = async (pathAndName: string, template : Buffer, varibles : Array<IDrawText>, optionsDraw : IPdfProperty) => {
  const pdfDoc = await PDFDocument.load(template)
  const pages = pdfDoc.getPages()

  pdfDoc.setTitle(optionsDraw.title || '')
  pdfDoc.setSubject(optionsDraw.subject || '')
  pdfDoc.setAuthor(optionsDraw.author || '')
  pdfDoc.setKeywords(optionsDraw.keywords || [])
  pdfDoc.setProducer(optionsDraw.producer || '')
  pdfDoc.setCreator(optionsDraw.creator || '')

  let i = 0
  for await (const page of pages) {
    varibles.forEach((rowVar : IDrawText) => {
      if (i === rowVar.page) {
        page.drawText(rowVar.text, rowVar.options)
      }
    })
    i++
  }

  const pdfBytes = await pdfDoc.save()
  await fs.writeFileSync(pathAndName, pdfBytes)
}

export const createHtmlToPdf = async (pathAndName: string, template : string, varibles : Array<any>) => {
  const htmlOK : any = await replaceAll(template, varibles)
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  // We set the page content as the generated html by handlebars
  await page.setContent(htmlOK)
  // We use pdf function to generate the pdf in the same folder as this file.
  await page.pdf({ path: pathAndName, format: 'A4' })
  await browser.close()
  return true
}

export const createImagePDF = async (pathAndName: string, template : Buffer, varibles : Array<IDrawImg>) => {
  const pdfDoc = await PDFDocument.load(template)
  const pages = pdfDoc.getPages()

  let j = 0
  for await (const page of pages) {
    for await (const rowPng of varibles) {
      const pngImage = await pdfDoc.embedPng(rowPng.sign)
      if (j === rowPng.page) {
        page.drawImage(pngImage, {
          x: rowPng.x,
          y: rowPng.y,
          width: rowPng.width,
          height: rowPng.height
        })
      }
    }
    j++
  }

  const pdfBytes = await pdfDoc.save()
  await fs.writeFileSync(pathAndName, pdfBytes)
}

export const templatePDF = (template : string) => {
  switch (template) {
    case 'rchprueba':

      break
  }
}
