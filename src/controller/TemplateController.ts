// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { validate } from 'class-validator'
import fs from 'fs'
import path from 'path'
import { Template } from '../entity/Template'
import { responseJSON } from '../utils/responseUtil'
import { errorsToSnake } from '../utils/myUtils'
const templatesPath = path.join(__dirname, '..\\resource\\template')

export class TemplateController {
  async read (req: Request, res: Response) {
    const { name_template: nameTemplate } = req.params

    if (!nameTemplate) {
      return responseJSON(false, 'parameters_missing', 'Faltan parametros', ['name_template'], 200)
    }
    try {
      const template = await getRepository(Template).createQueryBuilder('template')
        .where('template.isStatus = true AND template.name = :arg_name', { arg_name: nameTemplate })
        .leftJoinAndSelect('template.variables', 'variable')
        .getOne()

      if (!template) {
        return responseJSON(false, 'template_not_found', 'Template no encontrado', [nameTemplate], 200)
      }
      const base64PDF = await fs.readFileSync(`${templatesPath}\\${template.route}`, 'base64')
      return responseJSON(true, 'template_sent', 'Template enviado en base64', { base64: base64PDF }, 200)
    } catch (error) {
      return responseJSON(false, 'document_not_found', 'Documento no encontrado en el servidor', [], 200)
    }
  }

  async readAll (req: Request, res: Response) {
    const listTemplate = await getRepository(Template).createQueryBuilder('template')
      .where('template.isStatus = true')
      .leftJoinAndSelect('template.variables', 'variable')
      .getMany()

    const documentList = listTemplate.filter(file => file.type === 'document')
    const pdfList = listTemplate.filter(file => file.type === 'pdf')
    const mailingList = listTemplate.filter(file => file.type === 'mailing')

    return responseJSON(true, 'list_templates', 'Templates se envio una lista por tipo.', { list_html: documentList, list_pdf: pdfList, list_mailing: mailingList }, 200)
  }

  async create (req : Request, res : Response) {
    const { obj_template: bufferTemplate, obj_variables: bufferVariables } : any = req.body

    if (!bufferTemplate || !bufferVariables) {
      return responseJSON(true, 'missing_parameters', 'Falta el objeto template', ['obj_template', 'obj_variables'], 200)
    }

    const errTemplate = await validate(bufferTemplate, { validationError: { target: false, value: false } })
    if (errTemplate.length > 0) {
      return responseJSON(false, 'template_error', 'Template con errores', await errorsToSnake(errTemplate), 200)
    }

    const errVariables = await validate(bufferVariables, { validationError: { target: false, value: false } })
    if (errVariables.length > 0) {
      return responseJSON(false, 'variables_error', 'Variables con errores', await errorsToSnake(errVariables), 200)
    }

    try {
      const template = await getRepository(Template).save(bufferTemplate)
      return responseJSON(false, 'template_error', 'Template con errores', template, 200)
    } catch {
      return responseJSON(false, 'error_internal', 'Error Interno.', [], 200)
    }
  }
}
