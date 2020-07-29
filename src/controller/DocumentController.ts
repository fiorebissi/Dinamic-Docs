// eslint-disable-next-line no-unused-vars
import { Request, Response, NextFunction } from 'express'
import { getRepository } from 'typeorm'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { Template } from '../entity/Template'
import { Document } from '../entity/Document'
import { readExcel } from '../utils/myUtils'
import { createZIP, createDocument } from '../utils/document'
import { responseJSON } from '../utils/responseUtil'
import { parseRequest } from '../utils/multipart'
// eslint-disable-next-line no-unused-vars
import { IResponseDocument } from '../interface/IDocument'
// eslint-disable-next-line no-unused-vars
import { IResponsePromise } from '../interface/IPromise'
import { sendSmsGET, sendManySmsPOST, loginInfobip } from '../utils/infobip'
const templatesPath = path.join(__dirname, '..\\resource\\template')
const uploadsPath = path.join(__dirname, '..\\..\\uploads')
const getTokenInfoBip = loginInfobip()

export class DocumentController {
	/**
	 * Crea uno o varios archivos "document".
	 */
	async create (req : Request) {
		const { name_template: nameTemplate, records } = req.body
		if (!nameTemplate || !records || records.length < 1 || !process.env.SECRET_CRYPTO_DOC) {
			return responseJSON(false, 'parameters_missing', 'Faltan parametros', ['name_template', 'records'], 200)
		}

		const template = await getRepository(Template).createQueryBuilder('template')
			.where('template.isStatus = true AND template.name = :arg_name', { arg_name: nameTemplate })
			.innerJoinAndSelect('template.variables', 'variable')
			.getOne()

		if (!template || !template.variables) {
			return responseJSON(false, 'template-not_exist', 'Template no existe', [nameTemplate], 200)
		}

		/*
		////////////////////////////////
		VALIDAR QUE LOS "RECORDS" CUMPLAN CON LAS CANTIDAD DE VARIABLES QUE EXIGE EL TEMPLATE SELECCIONADO
		const nameVariables : any = template.variables.map(row => row.name)
		const registersErrors : Array<object> = records.filter((one : object) => !Object.prototype.hasOwnProperty.call(one, 'variables'))
		if (registersErrors.length > 0) {
			return responseJSON(false, 'registers-error_struct', 'Algunos regitros son erroneos', registersErrors, 200)
		}
		////////////////////////////////
		*/

		const document = await getRepository(Document).save({
			template: template,
			author: 'req.body.jwt_usuario_username',
			count: records.length,
			isStatus: true,
			createtAt: new Date(
				new Date().toLocaleString('es-AR', {
					timeZone: 'America/Argentina/Buenos_Aires'
				})
			)
		})

		try {
			const dataTemplate = await fs.readFileSync(`${templatesPath}\\document\\${template.nameFile}`, 'utf8')
			const newDirectory = `${uploadsPath}\\document_generated\\${document.id}`
			await fs.mkdirSync(newDirectory)
			const arrayDocument : Array<IResponseDocument> = []
			const arrayErrors : Array<Object> = []
			let i = 0
			for await (const record of records) {
				const result = await createDocument(`${newDirectory}\\${++i}.html`, dataTemplate, record, false)
				if (!result) {
					return arrayErrors.push({ i, error: 'Error en crear document' })
				}
				const encrypted = crypto.createHmac('sha256', process.env.SECRET_CRYPTO_DOC).update(`${document.id}-${i}`).digest('hex')
				const url = `http://www.rchdynamic.com.ar/dd/document/encrypted/${encrypted}/${document.id}-${i}/view`
				arrayDocument.push({ id: document.id, index: i, encrypted, url })
			}

			return responseJSON(true, 'documents-created', 'Generados Correctamente', arrayDocument, 201)
		} catch {
			return responseJSON(false, 'document-error_internal', 'Error Interno', [], 200)
		}
	}

	/**
 	*	Genera un zip con todos los "records" del "document" indicado.
 	*/
	async generateZip (req : Request) {
		const { id } = req.body
		if (!id || !process.env.SECRET_CRYPTO_DOC) {
			return responseJSON(false, 'parameters_missing', 'Parameters are missing', ['id'])
		}

		const document = await getRepository(Document).createQueryBuilder('document')
			.where('document.isStatus = true AND document.id = :arg_id', { arg_id: id })
			.getOne()

		if (!document || !document.id) {
			return responseJSON(false, 'document-not_exist', 'Document no existe', [])
		}
		try {
			const encrypted = crypto.createHmac('sha256', process.env.SECRET_CRYPTO_DOC).update(`${document.id}`).digest('hex')
			await createZIP(document.id)
			return responseJSON(true, 'document-zip_created', 'Archivo ZIP Generado Correctamente', { id: document.id, encrypted })
		} catch (error) {
			return responseJSON(false, 'document-error_internal', 'Error Interno', [], 200)
		}
	}

	/**
	 * Recibe un archivo excel(csv) y retorna su contenido en un JSON.
	 */
	async receiveExcel (req: Request) {
		const resultParse : IResponsePromise = await parseRequest(req)

		if (resultParse.error) {
			return responseJSON(false, 'document-parse_request', resultParse.message, [], 200)
		}
		const { name_template: nameTemplate, delimiter } = resultParse.body.fields
		const { fileCSV } = resultParse.body.files

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
		const { records } = req.body
		if (!records || records.length < 1 || !process.env.SECRET_CRYPTO_DOC) {
			return responseJSON(false, 'missing_parameters', 'Faltan Parametros', ['obj_registros'], 200)
		}

		const recordErrors : Array<object> = records.filter((one : object) => !Object.prototype.hasOwnProperty.call(one, 'id') || !Object.prototype.hasOwnProperty.call(one, 'encrypted') || !Object.prototype.hasOwnProperty.call(one, 'phone'))

		if (recordErrors.length > 0) {
			return responseJSON(false, 'missing_parameters', 'Registros con error', recordErrors, 200)
		}

		const errorsSMS : Array<Object> = []
		const manySMS : Array<Object> = []
		for await (const record of records) {
			/// /////////////////
			/// //////Este codigo valida que el "encrypted" recibido sera correcto.
			/// ////// Pero obviamente hace demorar mas la respuesta.
			/// //////////
			// const encryptServer = crypto.createHmac('sha256', process.env.SECRET_CRYPTO_DOC).update(`${registro.id}`).digest('hex')
			// if (registro.encrypted !== encryptServer) {
			// errorsSMS.push(registro)
			// } else {
			manySMS.push({
				from: '41793026700',
				destinations: [{ to: record.phone }],
				text: `Hola. Ingresa a la siguiente URL para ver el documento http://www.rchdynamic.com.ar/dd/document/encrypted/${record.encrypted}/${record.id}/view`
			})
			// }
		}

		if (manySMS.length < 1) {
			return responseJSON(false, 'data-undefined', 'No hay registros validos', [], 200)
		}

		const tokenInfoBip = await getTokenInfoBip()
		if (!tokenInfoBip) {
			return responseJSON(false, 'error-credenciales', 'No se pudo enviar ningun mensaje.', [])
		}
		await sendManySmsPOST(manySMS, tokenInfoBip)
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
