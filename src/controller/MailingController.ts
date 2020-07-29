// eslint-disable-next-line no-unused-vars
import { Request, Response, NextFunction } from 'express'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { getRepository } from 'typeorm'
import { Template } from '../entity/Template'
import { Mailing } from '../entity/Mailing'
import { createDocument } from '../utils/document'
import { responseJSON } from '../utils/responseUtil'
import { sendMailExternal, sendMail } from '../utils/mail'
import { Document } from '../entity/Document'
// eslint-disable-next-line no-unused-vars
import { IMail } from '../interface/IMail'
const templatePath = path.join(__dirname, '..\\resource\\template\\')
const uploadsPath = path.join(__dirname, '..\\..\\uploads\\')

export class MailingController {
	/**
	 * NOTA : EN DESUSO
	 * Crea un archivo mailing y lo aloja en el servidor
	 */
	async create (req : Request) {
		const { to, name_template: nameTemplate, variables } = req.body

		if (!to || !nameTemplate || !variables || !process.env.SECRET_CRYPTO_DOC) {
			return responseJSON(false, 'missing_parameters', 'Faltan parametros', ['to', 'name_template', 'viriables'])
		}

		const template = await getRepository(Template).createQueryBuilder('template')
			.where('template.isStatus = true AND template.name = :arg_name', { arg_name: nameTemplate })
			.getOne()

		if (!template) {
			return responseJSON(false, 'template_not_exist', 'Template no existe', [nameTemplate])
		}

		const objMailing : Mailing = {
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
			const mailing = await getRepository(Mailing).save(objMailing)
			const encrypted = crypto.createHmac('sha256', process.env.SECRET_CRYPTO_DOC).update(`${mailing.id}`).digest('hex')
			variables['{{cryptoURL}}'] = `${encrypted}/${mailing.id}`
			const document = `${uploadsPath}\\mailing_generated\\${mailing.id}.html`
			const template = await fs.readFileSync(`${templatePath}\\mailing\\${nameTemplate}.html`, 'utf8')
			await createDocument(document, template, variables, false)

			return responseJSON(true, 'mailing_created', 'Mailing Creado', { id: objMailing.id }, 201)
		} catch (error) {
			return responseJSON(false, 'error_internal', 'Error Interno.', [], 200)
		}
	}

	/**
	 * Crea uno o varios archivos mailing y lo aloja en el servidor
	 */
	async createMany (req : Request) {
		const { records, name_template: nameTemplate } = req.body

		if (!records || !nameTemplate) {
			return responseJSON(false, 'request-missing_parameters', 'Faltan parametros', ['records', 'name_template'])
		}

		const template = await getRepository(Template).createQueryBuilder('template')
			.where('template.name = :arg_name', { arg_name: nameTemplate })
			.getOne()

		if (!template) {
			return responseJSON(false, 'template-not_exist', 'Template no existe', [nameTemplate])
		}

		const registersErrors : Array<object> = records.filter((one : object) => !Object.prototype.hasOwnProperty.call(one, 'variables'))

		if (registersErrors.length > 0) {
			return responseJSON(false, 'registers-missing_parameters', 'Registros con error', registersErrors, 200)
		}

		const mailing = await getRepository(Mailing).save({
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
			const newDirectory = `${uploadsPath}\\mailing_generated\\${mailing.id}`
			await fs.mkdirSync(newDirectory)
			let i = 1
			const template = await fs.readFileSync(`${templatePath}\\mailing\\${nameTemplate}.html`, 'utf8')
			const newRecords : Array<any> = []
			for await (const oneRecord of records) {
				const pathFileMailing = `${newDirectory}\\${++i}.html`
				await createDocument(pathFileMailing, template, oneRecord.variables, false)
				newRecords.push({ index: i, to: oneRecord.to, title: 'hola' })
			}
			return responseJSON(true, 'mailing-created', 'Maling creados', { id: mailing.id, new_records: newRecords, count: mailing.count }, 201)
		} catch (error) {
			return responseJSON(false, 'error-internal', 'Error Interno.', [], 200)
		}
	}

	/**
	 * NOTA : EN DESUSO
	 * Crea uno o varios archivos mailing, luego los envia por mail junto con un enlace referenciado a un archivo "document".
	 */
	async createAndSendAddDocument (req : Request) {
		const { to, name_template: nameTemplate, document_id: documentID, variables } = req.body

		if (!to || !nameTemplate || !variables || !documentID || !process.env.SECRET_CRYPTO_DOC) {
			return responseJSON(false, 'missing_parameters', 'Missing Parameters', ['to', 'name_template', 'viriables', 'document_id'])
		}

		const template = await getRepository(Template).createQueryBuilder('template')
			.where('template.name = :arg_name', { arg_name: nameTemplate })
			.getOne()

		if (!template) {
			return responseJSON(false, 'template_not_exist', 'Template no existe', [nameTemplate])
		}

		const document = await getRepository(Document).createQueryBuilder('document')
			.where('document.id = :arg_id', { arg_id: documentID })
			.getOne()

		if (!document) {
			return responseJSON(false, 'document_not_exist', 'Documento no existe', [documentID])
		}

		const objMailing : Mailing = {
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
			const newMailing = await getRepository(Mailing).save(objMailing)
			const mailing = `${uploadsPath}\\mailing_generated\\${newMailing.id}.html`
			const encrypted = crypto.createHmac('sha256', process.env.SECRET_CRYPTO_DOC).update(`${document.id}`).digest('hex')
			variables['{{cryptoURL}}'] = `${encrypted}/${document.id}`
			const template = await fs.readFileSync(`${templatePath}\\mailing\\${nameTemplate}.html`, 'utf8')
			const htmlBases64 = await createDocument(mailing, template, variables, true)
			const resultMail = await sendMailExternal('Probando de Probando', to, Buffer.from(htmlBases64, 'base64').toString('utf8'))

			return responseJSON(true, 'mailing_created', 'Mailing created', { id: objMailing.id, result_mail: resultMail }, 201)
		} catch (error) {
			return responseJSON(false, 'error_internal', 'Error Internal.', [], 200)
		}
	}

	/**
	 * Crea uno o varios archivos mailing, luego los envia por mail junto con un enlace referenciado a un archivo "document".
	 */
	async createAndSendAddDocumentMany (req : Request) {
		const { records, name_template: nameTemplate } = req.body

		if (!records || !nameTemplate || !process.env.SECRET_CRYPTO_DOC) {
			return responseJSON(false, 'request-missing_parameters', 'Faltan parametros', ['records', 'name_template'])
		}

		const template = await getRepository(Template).createQueryBuilder('template')
			.where('template.name = :arg_name', { arg_name: nameTemplate })
			.getOne()

		if (!template) {
			return responseJSON(false, 'template-not_exist', 'Template no existe', [nameTemplate])
		}

		const registersErrors : Array<object> = records.filter((one : object) => !Object.prototype.hasOwnProperty.call(one, 'document_id') || !Object.prototype.hasOwnProperty.call(one, 'document_encrypted') || !Object.prototype.hasOwnProperty.call(one, 'email') || !Object.prototype.hasOwnProperty.call(one, 'variables'))

		if (registersErrors.length > 0) {
			return responseJSON(false, 'registers-missing_parameters', 'Registros con error', registersErrors, 200)
		}

		const objMailing : Mailing = {
			template: template,
			author: 'req.body.jwt_usuario_username',
			count: records.length,
			isStatus: true,
			createtAt: new Date(
				new Date().toLocaleString('es-AR', {
					timeZone: 'America/Argentina/Buenos_Aires'
				})
			)
		}
		try {
			const mailing = await getRepository(Mailing).save(objMailing)
			const newDirectory = `${uploadsPath}\\mailing_generated\\${mailing.id}`
			await fs.mkdirSync(newDirectory)
			const manyMailing : Array<IMail> = []
			let i = 1
			const template = await fs.readFileSync(`${templatePath}\\mailing\\${nameTemplate}.html`, 'utf8')
			for await (const register of records) {
				const pathFileMailing = `${newDirectory}\\${i++}.html`
				const htmlBases64 = await createDocument(pathFileMailing, template, register.variables, true)
				manyMailing.push({ from: '"Ramon Chozas" <contacto@documentosdinamicos.com.ar>', subject: 'Hola', to: register.to, html: Buffer.from(htmlBases64, 'base64').toString('utf8') })
			}

			const { message: resultMail } = await sendMail(manyMailing)

			return responseJSON(true, 'mailing-created', 'Maling creados y enviados', { id: mailing.id, result_mail: resultMail, count: mailing.count }, 201)
		} catch (error) {
			return responseJSON(false, 'error-internal', 'Error Interno.', [], 200)
		}
	}

	/**
	 * NOTA : EN DESUSO
	 * Envia un archivo mailing(ya existente) por correo.
	 */
	async send (req : Request) {
		const { to, mailing_id: mailingID } = req.body

		if (!to || !mailingID) {
			return responseJSON(false, 'missing_parameters', 'Faltan parametros', ['to', 'mailing_id'])
		}

		try {
			const mailing = await getRepository(Mailing).createQueryBuilder('mailing')
				.where('mailing.id = :arg_id', { arg_id: mailingID })
				.getOne()

			if (!mailing) {
				return responseJSON(false, 'mailing-not_exist', 'Mailing no existe', [])
			}
			const fileMailing = await fs.readFileSync(`${uploadsPath}\\mailing_generated\\${mailing.id}.html`, 'utf8')
			const resultMail = await sendMailExternal('Probando de Probando', to, fileMailing)

			return responseJSON(true, 'mailing-sent', 'Correo electronico fue enviado.', { id: mailingID, result_mail: resultMail }, 200)
		} catch {
			return responseJSON(false, 'mailing-not_found', 'Mailing no encontrado', [])
		}
	}

	/**
	 * Envia uno o varios archivos mailing(ya existente) por correo electronico.
	 */
	async sendMany (req : Request) {
		const { mailing_id: mailingID, records } = req.body

		if (!mailingID || !records || records.length < 1) {
			return responseJSON(false, 'request-missing_parameters', 'Faltan parametros', ['records', 'mailing_id'])
		}

		const registersErrors : Array<object> = records.filter((one : object) => !Object.prototype.hasOwnProperty.call(one, 'to') || !Object.prototype.hasOwnProperty.call(one, 'title') || !Object.prototype.hasOwnProperty.call(one, 'index'))

		if (registersErrors.length > 0) {
			return responseJSON(false, 'registers-missing_parameters', 'Registros con error', registersErrors, 200)
		}

		const mailing = await getRepository(Mailing).createQueryBuilder('mailing')
			.where('mailing.id = :arg_id', { arg_id: mailingID })
			.getOne()

		if (!mailing || !mailing.count) {
			return responseJSON(false, 'mailing-not_exist', 'Mailing no existe', [])
		}

		if (records.length > mailing.count) {
			return responseJSON(false, 'mailing-count', 'Envió mas registros de lo esperado.', [])
		}

		try {
			const manyMailing : Array<IMail> = []
			for await (const record of records) {
				manyMailing.push({
					from: '"Ramon Chozas" <contacto@documentosdinamicos.com.ar>',
					to: record.to,
					subject: record.title,
					html: await fs.readFileSync(`${uploadsPath}\\mailing_generated\\${mailingID}\\${record.index}.html`, 'utf8')
				})
			}

			const { message: resultMail } = await sendMail(manyMailing)

			return responseJSON(true, 'mailing-sent', 'Correo electronico fue enviado.', { id: mailingID, result_mail: resultMail, count: mailing.count }, 200)
		} catch (error) {
			return responseJSON(false, 'mailing-error_read', 'Error en archivos del mailing', [])
		}
	}

	/**
	 * Lee un archivo mailing. Mediante el id y el encrypted
	 */
	async readEncrypted (req : Request) {
		const { encrypted, id } = req.params

		if (!parseInt(id) || !encrypted || !process.env.SECRET_CRYPTO_MAILING) {
			return responseJSON(false, 'parameters_missing', 'Faltan parametros', ['id', 'encrypted'], 200)
		}
		const encryptServer = crypto.createHmac('sha256', process.env.SECRET_CRYPTO_MAILING).update(`${id}`).digest('hex')

		if (encrypted !== encryptServer) {
			return responseJSON(false, 'error_unauthorized ', 'No Autorizado', [], 401)
		}

		try {
			const mailing = await getRepository(Mailing).createQueryBuilder('mailing')
				.where('mailing.isStatus = true AND mailing.id = :arg_id', { arg_id: id })
				.getOne()

			if (!mailing || !mailing.count) {
				return responseJSON(false, 'mailing-not_exist', 'Mailing no existe', [], 200)
			}

			const mailingBase64 = await fs.readFileSync(`${uploadsPath}\\mailing_generated\\${mailing.id}.html`, 'base64')
			return responseJSON(true, 'mailing-sent', 'Mailing Enviado', { base64: mailingBase64 }, 200)
		} catch (error) {
			return responseJSON(false, 'mailing-not_found', 'Mailing no encontrado en el servidor', [], 404)
		}
	}

	/**
	 * Crea y envia un archivo mailing por correo.
	 * Este metodo es DEPENDIENTE de los metodos "createMany" y "sendMany"
	 */
	async createAndSend (req : Request) {
		const resultCreate : any = await this.createMany(req)
		if (!Object.prototype.hasOwnProperty.call(resultCreate.body, 'id')) {
			return resultCreate
		}

		req.body.records = resultCreate.body.new_records
		req.body.mailing_id = resultCreate.body.id
		const resultSend : any = await this.sendMany(req)

		if (resultSend.type !== 'success') {
			return resultCreate
		}
		return resultSend
	}
}
