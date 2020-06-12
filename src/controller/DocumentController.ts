// eslint-disable-next-line no-unused-vars
import { Request, Response, NextFunction } from 'express'
import { getRepository } from 'typeorm'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { Template } from '../entity/Template'
import { Document } from '../entity/Document'
import { readExcel } from '../utils/myUtils'
import { createOne, createMany, createZIP } from '../utils/document'
import { responseJSON } from '../utils/responseUtil'
import { formRequest } from '../utils/multipart'
import { sendSmsGET } from '../utils/infobip'
// import { sendSmsGET } from '../utils/infobip'
const templatesPath = path.join(__dirname, '..\\resource\\template')
const uploadsPath = path.join(__dirname, '..\\..\\uploads')

export class DocumentController {
	async createHTML (req : Request, res : Response) {
		const { name_template: nameTemplate, data } = req.body
		if (!nameTemplate || !data || data.length < 1 || !process.env.SECRET_CRYPTO_DOC) {
			return responseJSON(false, 'parameters_missing', 'Parameters are missing', ['name_template', 'variables'], 200)
		}

		const template = await getRepository(Template).createQueryBuilder('template')
			.where('template.isStatus = true AND template.name = :arg_name', { arg_name: nameTemplate })
			.getOne()

		if (!template) {
			return responseJSON(false, 'template_not_exist', 'Template no existe', [nameTemplate], 200)
		}

		const document = await getRepository(Document).save({
			template: template,
			author: 'req.body.jwt_usuario_username',
			count: data.length,
			isStatus: true,
			createtAt: new Date(
				new Date().toLocaleString('es-AR', {
					timeZone: 'America/Argentina/Buenos_Aires'
				})
			)
		})

		if (!document || !document.id) {
			return responseJSON(false, 'document-error_document', 'Error al registrar documento', [], 200)
		}
		try {
			const cryptoId = crypto.createHmac('sha256', process.env.SECRET_CRYPTO_DOC).update(`${document.id}`).digest('hex')
			const dataTemplate = await fs.readFileSync(`${templatesPath}\\document\\${template.nameFile}`, 'utf8')
			if (data.length > 1) {
				const result = await createMany(document.id, data, dataTemplate)
				if (result.length > 1) {
					return responseJSON(true, 'document-error_many', 'Error en algunos registros', result, 200)
				}
				await createZIP(document.id)
				return responseJSON(true, 'document-zip_created', 'Archivo ZIP Generado Correctamente', { id: document.id, encrypted: cryptoId }, 201)
			}

			const result = await createOne(document.id, data[0], dataTemplate)

			if (!result) {
				return responseJSON(true, 'document-error_created', 'Error al generar documento', [], 200)
			}

			return responseJSON(true, 'document_created', 'Generado Correctamente', { id: document.id, encrypted: cryptoId, base64: result }, 201)
		} catch (error) {
			console.info('error.message :>> ', error.message)
			return responseJSON(false, 'document-error_internal', 'Error Interno', [], 200)
		}
	}

	async createExcel (req: Request, res: Response) {
		return formRequest(req).then(async path => {
			const dataExcel : any = await readExcel(`${path}`)
			/*
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
					await createDocument(`${uploadsPath}\\document_generated\\${i}.html`, bufferTemplate, variables, false)
				}
				*/
			return responseJSON(true, 'html_generate', 'Datos Cargados y Generados.', { list_user: dataExcel, count: dataExcel.length }, 200)
		}).catch(error => responseJSON(false, error.result, error.message, [], 200))
	}

	async sendSMS (req: Request, res:Response) {
		const { id, encrypted, phone } = req.body
		if (!id || !encrypted || !phone || !process.env.SECRET_CRYPTO_DOC) {
			return responseJSON(false, 'missing_parameters', 'Faltan Parametros', ['id', 'encrypted', 'phone'], 200)
		}

		/*
		if (id !== req.body.jwt_user_id) {
			return responseJSON(false, 'error_unauthorized', 'No Autorizado', [], 401)
		}
		*/
		const encryptServer = crypto.createHmac('sha256', process.env.SECRET_CRYPTO_DOC).update(`${id}`).digest('hex')

		if (encrypted !== encryptServer) {
			return responseJSON(false, 'error_unauthorized ', 'No Autorizado', [], 401)
		}
		if (!process.env.USER_INFOBIP || !process.env.PASSWORD_INFOBIP) {
			return responseJSON(false, 'error_internal', 'Sin credenciales para enviar sms', [], 200)
		}
		const textSMS = `Hola. Ingresa a la siguiente URL para ver el documento http://www.dynamicdoc.com.ar/#/home/dd/${encrypted}/${id}`
		const resultSMS : any = await sendSmsGET(phone, textSMS, process.env.USER_INFOBIP, process.env.PASSWORD_INFOBIP)
		return responseJSON(true, 'sms_sent', 'Mensaje enviado', { result_message: resultSMS[0] }, 201)
	}

	async readEncrypted (req: Request, res: Response, next : NextFunction) {
		const { encrypted, id } = req.params

		if (!parseInt(id) || !encrypted || !process.env.SECRET_CRYPTO_DOC) {
			return responseJSON(false, 'parameters_missing', 'Parameters are missing', ['id', 'encrypted'], 200)
		}
		const encryptServer = crypto.createHmac('sha256', process.env.SECRET_CRYPTO_DOC).update(`${id}`).digest('hex')

		if (encrypted !== encryptServer) {
			return responseJSON(false, 'error_unauthorized ', 'No Autorizado', [], 401)
		}
		try {
			const document = await getRepository(Document).createQueryBuilder('document')
				.where('document.isStatus = true AND document.id = :arg_id', { arg_id: id })
				.getOne()

			if (!document || !document.count) {
				return responseJSON(false, 'document_not_exist', 'Documento no existe', [], 200)
			}

			if (document.count > 1) {
				const zipBase64 = await fs.readFileSync(`${uploadsPath}\\document_generated\\${document.id}.zip`, 'base64')
				return responseJSON(true, 'zip_sent', 'ZIP Enviado', { base64: zipBase64 }, 200)
			}
			const documentBase64 = await fs.readFileSync(`${uploadsPath}\\document_generated\\${document.id}.html`, 'base64')
			return responseJSON(true, 'document_sent', 'Documento Enviado', { base64: documentBase64 }, 200)
		} catch (error) {
			console.info(error.message)
			return responseJSON(false, 'document_not_found', 'Documento no encontrado en el servidor', [], 404)
		}
	}
}
