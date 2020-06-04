// eslint-disable-next-line no-unused-vars
import { Request, Response, NextFunction } from 'express'
import { getRepository } from 'typeorm'
import fs from 'fs'
import path from 'path'
import { Template } from '../entity/Template'
import { Document } from '../entity/Document'
import { readExcel } from '../utils/myUtils'
import { createDocument } from '../utils/document'
import { responseJSON } from '../utils/responseUtil'
import { formRequest } from '../utils/multipart'
const templatesPath = path.join(__dirname, '..\\resource\\template')
const uploadsPath = path.join(__dirname, '..\\..\\uploads')

export class DocumentController {
  async createHTML (req : Request, res : Response) {
    const { name_template: nameTemplate, variables } = req.body
    if (!nameTemplate || !variables) {
      return responseJSON(false, 'parameters_missing', 'Parameters are missing', ['name_template', 'variables'], 200)
    }

    const template = await getRepository(Template).createQueryBuilder('template')
      .where('template.isStatus = true AND template.name = :arg_name', { arg_name: nameTemplate })
      .getOne()

    if (!template) {
      return responseJSON(false, 'template_not_exist', 'Template no existe', [nameTemplate], 200)
    }

    const objDocument : Document = {
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
      const newDocument = await getRepository(Document).save(objDocument)
      const document = `${uploadsPath}\\html_generated\\${newDocument.id}.html`
      const dataTemplate = await fs.readFileSync(`${templatesPath}\\document\\${template.nameFile}`, 'utf8')
      const htmlOK = await createDocument(document, dataTemplate, variables)

      if (!htmlOK) {
        return responseJSON(false, 'error_internal', 'Error in variables', [], 200)
      }

      return responseJSON(true, 'html_created', 'HTML created', { base64: htmlOK }, 201)
    } catch (error) {
      console.info(error.message)
      return responseJSON(false, 'template_not_found', `Template '${nameTemplate}' no encontrado`, [], 200)
    }
  }

  async createExcel (req: Request, res: Response) {
    const { name_template: nameTemplate } = req.params
    if (!nameTemplate) {
      return responseJSON(false, 'parameters_missing', 'Parameters are missing', ['name_template'], 200)
    }

    try {
      const templateEmail = await fs.readFileSync(`${templatesPath}\\document\\${nameTemplate}.html`, 'utf8')
      return formRequest(req).then(async path => {
        const dataExcel : any = await readExcel(`${path}`)
        let i = 0

        for await (const item of dataExcel) {
          i++
          const bufferTemplate = templateEmail
          const variables : any = {
            '{{firstName}}': item.firstName,
            '{{lastName}}': item.lastName,
            '{{email}}': item.email,
            '{{enterprise}}': item.enterprise
          }
          await createDocument(`${uploadsPath}\\html_generated\\${i}.html`, bufferTemplate, variables)
        }
        return responseJSON(true, 'html_generate', 'Datos Cargados y Generados.', { list_user: dataExcel, count: i }, 200)
      }).catch(error => responseJSON(false, error.result, error.message, [], 200))
    } catch (error) {
      return responseJSON(false, 'template_not_found', `Template '${nameTemplate}' no encontrado`, [], 200)
    }
  }

  async read (req: Request, res: Response) {
    const { id } = req.params
    if (!parseInt(id)) {
      return responseJSON(false, 'parameters_missing', 'Parameters are missing', ['id'], 200)
    }
    try {
      const document = await getRepository(Document).createQueryBuilder('document')
        .where('document.isStatus = true AND document.id = :arg_id', { arg_id: id })
        .getOne()

      if (!document) {
        return responseJSON(false, 'document_not_exist', 'Document not exist', [], 200)
      }

      const base64PDF = await fs.readFileSync(`${uploadsPath}\\html_generated\\${document.id}.html`, 'base64')
      return responseJSON(true, 'html_sent', 'HTML sent', { base64: base64PDF }, 200)
    } catch (error) {
      return responseJSON(false, 'document_not_found', 'Document not found', [], 200)
    }
  }

  async readEncrypt (req: Request, res: Response) {
    const { encrypted_id: encryptedId } = req.params
    if (!encryptedId) {
      return responseJSON(false, 'parameters_missing', 'Parameters are missing', ['encrypted_id'])
    }
    try {
      const id = encryptedId
      const base64PDF = await fs.readFileSync(`${uploadsPath}\\html_generated\\${id}.html`, 'base64')
      return responseJSON(true, 'pdf_sent', 'PDF sent', { base64: base64PDF }, 200)
    } catch (error) {
      return responseJSON(false, 'document_not_found', 'Documento not found', [], 200)
    }
  }
}
