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
import { parseRequest } from '../utils/multipart'
import { sendSmsGET } from '../utils/infobip'
const templatesPath = path.join(__dirname, '..\\resource\\template')
const uploadsPath = path.join(__dirname, '..\\..\\uploads')

export class DocumentController {
	async createHTML (req : Request) {
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

		try {
			const dataTemplate = await fs.readFileSync(`${templatesPath}\\document\\${template.nameFile}`, 'utf8')
			const arrayDocument : Array<any> = []
			for await (const oneData of data) {
				const document = await getRepository(Document).save({
					template: template,
					author: 'req.body.jwt_usuario_username',
					count: 1,
					isStatus: true,
					createtAt: new Date(
						new Date().toLocaleString('es-AR', {
							timeZone: 'America/Argentina/Buenos_Aires'
						})
					)
				})

				if (!document || !document.id) {
					return null
				}

				const result = await createOne(document.id, oneData, dataTemplate)
				if (!result) {
					return null
				}
				const cryptoId = crypto.createHmac('sha256', process.env.SECRET_CRYPTO_DOC).update(`${document.id}`).digest('hex')
				arrayDocument.push({ id: document.id, encrypted: cryptoId })
			}

			if (data.length === 1) {
				const documentBase64 : any = await fs.readFileSync(`${uploadsPath}\\document_generated\\${arrayDocument[0].id}.html`, 'base64')
				const nuevoArray = { ...arrayDocument[0], base64: documentBase64 }
				return responseJSON(true, 'document_created', 'Generado Correctamente', nuevoArray, 201)
			}

			return responseJSON(true, 'documents_created', 'Generados Correctamente', arrayDocument, 201)
		} catch (error) {
			console.info('error.message :>> ', error.message)
			return responseJSON(false, 'document-error_internal', 'Error Interno', [], 200)
		}
	}

	async createHTMLGenerandoUnZIP (req : Request) {
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
					return responseJSON(false, 'document-error_many', 'Error en algunos registros', result, 200)
				}
				await createZIP(document.id)
				return responseJSON(true, 'document-zip_created', 'Archivo ZIP Generado Correctamente', { id: document.id, encrypted: cryptoId }, 201)
			}

			const result = await createOne(document.id, data[0], dataTemplate)

			if (!result) {
				return responseJSON(false, 'document-error_created', 'Error al generar documento', [], 200)
			}

			return responseJSON(true, 'document_created', 'Generado Correctamente', { id: document.id, encrypted: cryptoId, base64: result }, 201)
		} catch (error) {
			console.info('error.message :>> ', error.message)
			return responseJSON(false, 'document-error_internal', 'Error Interno', [], 200)
		}
	}

	async createExcel (req: Request) {
		const body : any = await parseRequest(req)
		const { name_template: nameTemplate, delimiter } = body.fields
		const {fileCSV } = body.files

		if (body.result !== 'success') {
			return responseJSON(false, 'document-parse_csv', body.message, [], 200)
		}

		if (!nameTemplate || !delimiter) {
			return responseJSON(false, 'document-name_template', 'Falta el template', ['name_template', 'delimiter'], 200)
		}

		if (delimiter !== ';' && delimiter !== ',') {
			return responseJSON(false, 'document-delimiter', 'Separador erroneo', [], 200)
		}

		if (!fileCSV) {
			return responseJSON(false, 'document-file_not_found', 'Archivo no encontrado.', ['fileCSV'], 200)
		}

		if (fileCSV.type !== 'text/csv' && fileCSV.type !== 'application/vnd.ms-excel') {
			return responseJSON(false, 'document-type_csv', 'EL tipo de archivo es incorrecto.', [fileCSV.type], 200)
		}
		
		const template = await getRepository(Template).createQueryBuilder('template')
			.where('template.isStatus = true AND template.name = :arg_name', { arg_name: nameTemplate })
			.innerJoinAndSelect('template.variables', 'variable')
			.getOne()

		if (!template || !template.variables ) {
			return responseJSON(false, 'document-template', 'Falta el template', [], 200)
		}

		// OBTENER UN ARRAY DE LA KEY DEL TEMPLATE
		const arrayDeVariables = template.variables.map(row => row.name)

		
		try {
			const dataExcel : any = await readExcel(`${fileCSV.path}`, arrayDeVariables, delimiter)
			return responseJSON(true, 'document-generate', 'Datos Cargados y Generados.', { list_user: dataExcel, count: dataExcel.length }, 200)
		} catch (error) {
			return responseJSON(false, 'document-structuc', error, [], 200)
		}
	}

	async sendSMS (req: Request) {
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
		const textSMS = `Hola. Ingresa a la siguiente URL para ver el documento http://www.rchdynamic.com.ar/dd/document/encrypted/${encrypted}/${id}/view`
		const resultSMS : any = await sendSmsGET(phone, textSMS, process.env.USER_INFOBIP, process.env.PASSWORD_INFOBIP)
		return responseJSON(true, 'sms_sent', 'Mensaje enviado', { result_message: resultSMS[0] }, 201)
	}

	async readEncrypted (req: Request) {
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

	async readAndView (req: Request, res : Response) {
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

			const dataDocument = await fs.readFileSync(`${uploadsPath}\\document_generated\\${document.id}.html`, 'utf8')
			res.send(dataDocument)
		} catch (error) {
			console.info(error.message)
			return responseJSON(false, 'document_not_found', 'Documento no encontrado en el servidor', [], 404)
		}
	}
}
