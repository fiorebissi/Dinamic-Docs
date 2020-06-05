// eslint-disable-next-line no-unused-vars
import { Request, Response, NextFunction } from 'express'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { getRepository } from 'typeorm'
import { Template } from '../entity/Template'
import { Pdf } from '../entity/Pdf'
import { responseJSON } from '../utils/responseUtil'
import { setTextPoliza, setSignPoliza } from '../utils/polizaPDF'
import { sendSmsGET } from '../utils/infobip'
import { createPdfToPdf, createHtmlToPdf, createImagePDF } from '../utils/pdf'
const templatesPath = path.join(__dirname, '..\\resource\\template')
const uploadsPath = path.join(__dirname, '..\\..\\uploads')

export class PdfController {
  async createHtmlToPdf (req: Request, res: Response) {
    const { variables, name_template: nameTemplate } = req.body

    if (!variables || !nameTemplate) {
      return responseJSON(false, 'parameters_missing', 'Falta nombre de pdf', ['variables', 'name_template'])
    }

    const template = await getRepository(Template).createQueryBuilder('template')
      .where('template.name = :arg_name', { arg_name: nameTemplate })
      .getOne()

    if (!template) {
      return responseJSON(false, 'template_not_exist', 'Template no existe', [nameTemplate])
    }

    const objPdf : Pdf = {
      template: template,
      author: 'req.body.jwt_usuario_username',
      count: 1,
      isStatus: true,
      createtAt: new Date(
        new Date().toLocaleString('es-AR', {
          timeZone: 'America/Argentina/Buenos_Aires'
        })
      )
    }
    try {
      const newPdf = await getRepository(Pdf).save(objPdf)
      const pathPDF = `${uploadsPath}\\pdf_generated\\${newPdf.id}.pdf`
      const fileTemplate = await fs.readFileSync(`${templatesPath}\\pdf\\${nameTemplate}.html`, 'utf8')
      await createHtmlToPdf(pathPDF, fileTemplate, variables)

      const base64PDF = await fs.readFileSync(pathPDF, 'base64')
      return responseJSON(true, 'pdf_created', 'PDF creado', { id: newPdf.id, base64: base64PDF }, 201)
    } catch (error) {
      return responseJSON(false, 'template_not_found', 'Template no encontrado', [])
    }
  }

  async setTextInPdf (req: Request, res: Response) {
    const { variables, name_template: nameTemplate } = req.body

    if (!variables || !nameTemplate || !process.env.SECRET_CRYPTO) {
      return responseJSON(false, 'parameters_missing', 'Falta nombre de pdf', ['variables', 'name_template'])
    }

    const template = await getRepository(Template).createQueryBuilder('template')
      .where('template.name = :arg_name', { arg_name: nameTemplate })
      .getOne()

    if (!template) {
      return responseJSON(false, 'template_not_exist', 'Template no existe', [nameTemplate])
    }

    const objPdf : Pdf = {
      template: template,
      count: 1,
      author: 'req.body.jwt_usuario_username',
      isStatus: true,
      createtAt: new Date(
        new Date().toLocaleString('es-AR', {
          timeZone: 'America/Argentina/Buenos_Aires'
        })
      )
    }
    try {
      const newPdf = await getRepository(Pdf).save(objPdf)
      const cryptoId = crypto.createHmac('sha256', process.env.SECRET_CRYPTO).update(`${newPdf.id}`).digest('hex')

      const pathPDF = `${uploadsPath}\\pdf_generated\\${newPdf.id}.pdf`
      const template = await fs.readFileSync(`${templatesPath}\\pdf\\${nameTemplate}.pdf`)
      let objs

      switch (nameTemplate) {
        case 'poliza':
          objs = await setTextPoliza(variables)
          break
          /*
          case 'recibo':
            objs = await setTextPoliza(variables)
            break
            */
      }

      if (!objs) {
        return responseJSON(false, 'template_not_found', 'Template no encontrado', { name_template: nameTemplate })
      }
      const [objGeneric, arrDrawText, objProperty] = objs
      await createPdfToPdf(pathPDF, template, arrDrawText, objProperty)

      /*
      const token = await loginInfobip(process.env.USER_INFOBIP, process.env.PASSWORD_INFOBIP)
      if (!token) {
        return responseJSON(true, 'pdf_created', 'Mensaje no enviado. Erro Login', { url: `http://www.dynamicdoc.com.ar/generar/#/home/firmar/${idRandom}` }, 201)
      }
      const resultSMS : any = await sendSmsPOST(objPoliza.phone, textSMS, token)

      if (!resultSMS) {
        return responseJSON(true, 'pdf_created', 'Mensaje no enviado', { url: `http://www.dynamicdoc.com.ar/generar/#/home/firmar/${idRandom}` }, 201)
      }
      */

      if (!process.env.USER_INFOBIP || !process.env.PASSWORD_INFOBIP) {
        return responseJSON(true, 'pdf_created', 'No se puedo enviar el mensaje. Credenciales no definidas', [], 200)
      }
      const textSMS = `Hola ${objGeneric.firstName} ${objGeneric.lastName}. Ingresa a la siguiente URL para firmar el documento http://www.dynamicdoc.com.ar/generar/#/home/firmar/${cryptoId}/${newPdf.id}`
      const resultSMS : any = await sendSmsGET(objGeneric.phone, textSMS, process.env.USER_INFOBIP, process.env.PASSWORD_INFOBIP)

      return responseJSON(true, 'pdf_created', 'Mensaje enviado', { id: newPdf.id, result_message: resultSMS[0] }, 201)
    } catch (error) {
      return responseJSON(false, 'error_interno', 'Error Interno', [], 200)
    }
  }

  async setPngInPdf (req: Request, res: Response) {
    const { encrypt_req: encryptReq, id, sign } = req.body

    if (!encryptReq || !id || !sign || !process.env.SECRET_CRYPTO) {
      return responseJSON(false, 'parameters_missing', 'Faltan parametros', ['encrypt_req', 'sign', 'id'])
    }

    const encryptServer = crypto.createHmac('sha256', process.env.SECRET_CRYPTO).update(`${id}`).digest('hex')

    if (encryptReq !== encryptServer) {
      return responseJSON(false, 'error_unauthorized ', 'No Autorizado', [], 401)
    }
    const pdf = await getRepository(Pdf).createQueryBuilder('pdf')
      .where('pdf.isStatus = true AND pdf.id = :arg_id', { arg_id: id })
      .getOne()

    if (!pdf) {
      return responseJSON(false, 'pdf_not_exist', 'Pdf no existe', [])
    }

    if (pdf.isSigned) {
      return responseJSON(false, 'pdf_previously_signed', 'Pdf firmado previamente', [])
    }
    const pathNewPDF = `${uploadsPath}\\pdf_generated\\${pdf.id}_signed.pdf`

    try {
      const filePdf = await fs.readFileSync(`${uploadsPath}\\pdf_generated\\${id}.pdf`)
      const arrDrawImg = setSignPoliza(sign)
      await createImagePDF(pathNewPDF, filePdf, arrDrawImg)
      const base64PDF = await fs.readFileSync(pathNewPDF, 'base64')
      await getRepository(Pdf).save({ ...pdf, isSigned: true })
      return responseJSON(true, 'pdf_signed', 'PDF firmado y enviado.', { id: id, base64: base64PDF }, 201)
    } catch (error) {
      return responseJSON(false, 'error_internal', 'Error interno.', [], 200)
    }
  }

  async savePdf (req: Request, res: Response) {
    const { name_template: nameTemplate, file, sign } = req.body

    if (!nameTemplate || !file || !sign) {
      return responseJSON(false, 'parameters_missing', 'Faltan parametros', ['file', 'sign'])
    }
    const template = await getRepository(Template).createQueryBuilder('template')
      .where('template.isStatus = true AND template.name = :arg_name', { arg_name: nameTemplate })
      .getOne()

    if (!template) {
      return responseJSON(false, 'template_not_exist', 'Template no existe', [nameTemplate])
    }
    const objPdf : Pdf = {
      template: template,
      author: 'req.body.jwt_usuario_username',
      count: 1,
      isStatus: true,
      createtAt: new Date(
        new Date().toLocaleString('es-AR', {
          timeZone: 'America/Argentina/Buenos_Aires'
        })
      )
    }
    const newPdf = await getRepository(Pdf).save(objPdf)
    const pathDocument = `${uploadsPath}\\pdf_generated\\${newPdf.id}.pdf`
    try {
      await fs.writeFileSync(pathDocument, file)
      req.body.encryptedid = newPdf.id
      this.setPngInPdf(req, res)
    } catch (error) {
      return responseJSON(false, 'error_internal', 'Error interno', [], 200)
    }
  }

  async readEncrypt (req: Request, res: Response) {
    const { encrypt_req: encryptReq, id } = req.params

    if (!parseInt(id) || !encryptReq || !process.env.SECRET_CRYPTO) {
      return responseJSON(false, 'parameters_missing', 'Parameters are missing', ['id', 'encrypt_req'], 200)
    }
    const encryptServer = crypto.createHmac('sha256', process.env.SECRET_CRYPTO).update(`${id}`).digest('hex')

    if (encryptReq !== encryptServer) {
      return responseJSON(false, 'error_unauthorized ', 'No Autorizado', [], 401)
    }
    try {
      const pdf = await getRepository(Pdf).createQueryBuilder('pdf')
        .where('pdf.isStatus = true AND pdf.id = :arg_id', { arg_id: id })
        .getOne()

      if (!pdf) {
        return responseJSON(false, 'pdf_not_exist', 'Pdf no existe', [], 200)
      }

      const base64PDF = await fs.readFileSync(`${uploadsPath}\\pdf_generated\\${pdf.id}.pdf`, 'base64')
      return responseJSON(true, 'pdf_sent', 'PDf enviado', { base64: base64PDF }, 200)
    } catch (error) {
      return responseJSON(false, 'pdf_not_found', 'Pdf no encontrado en el servidor', [], 200)
    }
  }
}
