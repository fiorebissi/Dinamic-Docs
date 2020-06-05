// eslint-disable-next-line no-unused-vars
import { Request, Response, NextFunction } from 'express'
import { getRepository } from 'typeorm'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { Template } from '../entity/Template'
import { Document } from '../entity/Document'
import { readExcel } from '../utils/myUtils'
import { createDocument } from '../utils/document'
import { responseJSON } from '../utils/responseUtil'
import { formRequest } from '../utils/multipart'
const templatesPath = path.join(__dirname, '..\\resource\\template')
const uploadsPath = path.join(__dirname, '..\\..\\uploads')

export class DocumentController {
	/**
	 *
	 * @param req
	 * @param res
	 */
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
			const document = `${uploadsPath}\\document_generated\\${newDocument.id}.html`
			const dataTemplate = await fs.readFileSync(`${templatesPath}\\document\\${template.nameFile}`, 'utf8')
			const htmlOK = await createDocument(document, dataTemplate, variables)

			if (!htmlOK) {
				return responseJSON(false, 'error_internal', 'Error in variables', [], 200)
			}

			return responseJSON(true, 'html_created', 'HTML creado', { id: newDocument.id, base64: htmlOK }, 201)
		} catch (error) {
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
					await createDocument(`${uploadsPath}\\document_generated\\${i}.html`, bufferTemplate, variables)
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

			const base64document = await fs.readFileSync(`${uploadsPath}\\document_generated\\${document.id}.html`, 'base64')
			return responseJSON(true, 'html_sent', 'HTML sent', { base64: base64document }, 200)
		} catch (error) {
			return responseJSON(false, 'document_not_found', 'Document not found', [], 200)
		}
	}

	async readEncrypt (req: Request, res: Response, next : NextFunction) {
		const { encrypt_req: encryptReq, id } = req.params

		if (!parseInt(id) || !encryptReq || !process.env.SECRET_CRYPTO_DOC) {
			return responseJSON(false, 'parameters_missing', 'Parameters are missing', ['id', 'encrypt_req'], 200)
		}
		const encryptServer = crypto.createHmac('sha256', process.env.SECRET_CRYPTO_DOC).update(`${id}`).digest('hex')

		if (encryptReq !== encryptServer) {
			return responseJSON(false, 'error_unauthorized ', 'No Autorizado', [], 401)
		}
		try {
			const document = await getRepository(Document).createQueryBuilder('document')
				.where('document.isStatus = true AND document.id = :arg_id', { arg_id: id })
				.getOne()

			if (!document) {
				return responseJSON(false, 'document_not_exist', 'Documento no existe', [], 200)
			}

			const fileDocument = await fs.readFileSync(`${uploadsPath}\\document_generated\\${document.id}.html`, 'utf8')
			res.send(fileDocument)
			// const base64Document = await fs.readFileSync(`${uploadsPath}\\document_generated\\${document.id}.document`, 'base64')
			// return responseJSON(true, 'document_sent', 'document enviado', { base64: base64Document }, 200)
		} catch (error) {
			console.log(error.message)
			return responseJSON(false, 'document_not_found', 'Documento no encontrado en el servidor', [], 404)
		}
	}
}
