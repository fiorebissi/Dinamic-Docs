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
import { sendSmsGET, sendManySmsPOST, loginInfobip } from '../utils/infobip'
const templatesPath = path.join(__dirname, '..\\resource\\template')
const uploadsPath = path.join(__dirname, '..\\..\\uploads')
const getTokenInfoBip = loginInfobip()

export class DocumentController {
	/**
	 * crea uno o varios "document" dependiendo del "template" enviado.
	 */
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
				const encrypted = crypto.createHmac('sha256', process.env.SECRET_CRYPTO_DOC).update(`${document.id}`).digest('hex')
				arrayDocument.push({ id: document.id, encrypted })
			}

			if (data.length === 1) {
				const documentBase64 : any = await fs.readFileSync(`${uploadsPath}\\document_generated\\${arrayDocument[0].id}.html`, 'base64')
				const url = `http://www.rchdynamic.com.ar/dd/document/encrypted/${arrayDocument[0].encrypted}/${arrayDocument[0].id}/view`
				const nuevoArray = { ...arrayDocument[0], base64: documentBase64, url }
				return responseJSON(true, 'document_created', 'Generado Correctamente', nuevoArray, 201)
			}

			return responseJSON(true, 'documents_created', 'Generados Correctamente', arrayDocument, 201)
		} catch (error) {
			console.info('error.message :>> ', error.message)
			return responseJSON(false, 'document-error_internal', 'Error Interno', [], 200)
		}
	}

	/**
 	*	Crea un o unos "Document". De ser varios, genera un ZIP.
 	*/
	async createHtmlAndGenerateZip (req : Request) {
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

	/**
	 * Recibe un archivo excel(csv) y retorna su contenido en un JSON.
	 */
	async receiveExcel (req: Request) {
		const body : any = await parseRequest(req)
		const { name_template: nameTemplate, delimiter } = body.fields
		const { fileCSV } = body.files

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

		if (fileCSV.type !== 'text/csv' && fileCSV.type !== 'application/vnd.ms-excel' && fileCSV.type !== 'application/octet-stream') {
			return responseJSON(false, 'document-type_csv', 'El tipo de archivo es incorrecto.', [fileCSV.type], 200)
		}

		const template = await getRepository(Template).createQueryBuilder('template')
			.where('template.isStatus = true AND template.name = :arg_name', { arg_name: nameTemplate })
			.innerJoinAndSelect('template.variables', 'variable')
			.getOne()

		if (!template || !template.variables) {
			return responseJSON(false, 'document-template', 'Falta el template', [], 200)
		}

		// OBTENER UN ARRAY DE LA KEY DEL TEMPLATE
		const arrayDeVariables : any = template.variables.map(row => row.name)

		if (!arrayDeVariables || arrayDeVariables.length < 1) {
			return responseJSON(false, 'document-template_error', 'Error en variables del template', [])
		}

		try {
			const { error, data } = await readExcel(`${fileCSV.path}`, arrayDeVariables, delimiter)
			if (error) {
				return responseJSON(false, 'document-error_columns', error, [])
			}
			return responseJSON(true, 'document-generate', 'Datos Cargados y Generados.', { list_user: data, count: data?.length }, 200)
		} catch (error) {
			return responseJSON(false, 'document-structuc', 'Error Interno', [])
		}
	}

	/**
	 * Envia un mensaje texto con un enlace al "document" solicitado.
	 */
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

	/**
	 * Envia varios mensajes texto con un enlace al "document" solicitado.
	 */
	async sendManySMS (req: Request) {
		const { obj_registros: objRegistros } = req.body
		if (!objRegistros || objRegistros.length < 1 || !process.env.SECRET_CRYPTO_DOC) {
			return responseJSON(false, 'missing_parameters', 'Faltan Parametros', ['obj_registros'], 200)
		}

		const registrosErroneos : Array<any> = objRegistros.filter((one : any) => !Object.prototype.hasOwnProperty.call(one, 'id') || !Object.prototype.hasOwnProperty.call(one, 'encrypted') || !Object.prototype.hasOwnProperty.call(one, 'phone'))

		if (registrosErroneos.length > 0) {
			return responseJSON(false, 'missing_parameters', 'Registros con error', registrosErroneos, 200)
		}
		/*
		if (id !== req.body.jwt_user_id) {
			return responseJSON(false, 'error_unauthorized', 'No Autorizado', [], 401)
		}
		*/

		const errorsSMS : Array<Object> = []
		const manySMS : Array<Object> = []
		for await (const registro of objRegistros) {
			const encryptServer = crypto.createHmac('sha256', process.env.SECRET_CRYPTO_DOC).update(`${registro.id}`).digest('hex')
			if (registro.encrypted !== encryptServer) {
				errorsSMS.push(registro)
			} else {
				manySMS.push({
					from: '41793026700',
					destinations: [{ to: registro.phone }],
					text: `Hola. Ingresa a la siguiente URL para ver el documento http://www.rchdynamic.com.ar/dd/document/encrypted/${registro.encrypted}/${registro.id}/view`
				})
			}
		}

		if (manySMS.length < 1) {
			return responseJSON(false, 'data-undefined', 'No hay registros validos', [], 200)
		}

		await sendManySmsPOST(manySMS, await getTokenInfoBip())
		return responseJSON(true, 'sms_sent', 'Mensajes enviados', errorsSMS, 201)
	}

	/**
	 * Lee un "document" y lo envia en base64. Obteniendo el id desde un valor encriptado.
	 */
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
			return responseJSON(false, 'document_not_found', 'Documento no encontrado en el servidor', [], 404)
		}
	}

	/**
	 * Lee un "document" y lo envia en texto plano. Obteniendo el id desde un valor encriptado.
	 */
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
			return responseJSON(false, 'document_not_found', 'Documento no encontrado en el servidor', [], 404)
		}
	}
}
