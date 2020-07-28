// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import fs from 'fs'
import path from 'path'
import { Template } from '../entity/Template'
import { responseJSON } from '../utils/responseUtil'
const templatesPath = path.join(__dirname, '..\\resource\\template')

export class SmsController {
	async create (req: Request, res: Response) {
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
			const base64PDF = await fs.readFileSync(`${templatesPath}\\${template.nameFile}`, 'base64')
			return responseJSON(true, 'template_sent', 'Template enviado en base64', { base64: base64PDF }, 200)
		} catch (error) {
			return responseJSON(false, 'document_not_found', 'Documento no encontrado en el servidor', [], 200)
		}
	}
}
