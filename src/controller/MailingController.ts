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
import { sendMailExternal } from '../utils/mail'
import { Document } from '../entity/Document'
import { sendEmailPOST } from '../utils/infobip'
const templatePath = path.join(__dirname, '..\\resource\\template\\')
const uploadsPath = path.join(__dirname, '..\\..\\uploads\\')

export class MailingController {
	async create (req : Request, res: Response) {
		const { to, name_template: nameTemplate, variables } = req.body

		if (!to || !nameTemplate || !variables || !process.env.SECRET_CRYPTO) {
			return responseJSON(false, 'missing_parameters', 'Missing Parameters', ['to', 'name_template', 'viriables'])
		}

		const template = await getRepository(Template).createQueryBuilder('template')
			.where('template.isStatus = true AND template.name = :arg_name', { arg_name: nameTemplate })
			.getOne()

		if (!template) {
			return responseJSON(false, 'template_not_exist', 'Template not exist', [nameTemplate])
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
			const cryptoId = crypto.createHmac('sha256', process.env.SECRET_CRYPTO).update(`${newMailing.id}`).digest('hex')
			variables['{{cryptoURL}}'] = `${cryptoId}/${newMailing.id}`
			const document = `${uploadsPath}\\mailing_generated\\${newMailing.id}.html`
			const template = await fs.readFileSync(`${templatePath}\\mailing\\${nameTemplate}.html`, 'utf8')
			const htmlBases64 = await createDocument(document, template, variables, true)

			return responseJSON(true, 'mailing_created', 'Mailing created', { id: objMailing.id, base64: htmlBases64 }, 201)
		} catch (error) {
			return responseJSON(false, 'error_internal', 'Error Internal.', [], 200)
		}
	}

	async createAndSend (req : Request, res: Response) {
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
			const cryptoID = crypto.createHmac('sha256', process.env.SECRET_CRYPTO_DOC).update(`${document.id}`).digest('hex')
			variables['{{cryptoURL}}'] = `${cryptoID}/${document.id}`
			const template = await fs.readFileSync(`${templatePath}\\mailing\\${nameTemplate}.html`, 'utf8')
			const htmlBases64 = await createDocument(mailing, template, variables, true)
			const resultMail = await sendMailExternal('Probando de Probando', to, Buffer.from(htmlBases64, 'base64').toString('utf8'))

			return responseJSON(true, 'mailing_created', 'Mailing created', { id: objMailing.id, result_mail: resultMail, base64: htmlBases64 }, 201)
		} catch (error) {
			return responseJSON(false, 'error_internal', 'Error Internal.', [], 200)
		}
	}

	async send (req : Request) {
		const { to, id } = req.body

		if (!to || !id) {
			return responseJSON(false, 'missing_parameters', 'Missing Parameters', ['to', 'id'])
		}

		try {
			const mailing = await getRepository(Mailing).createQueryBuilder('mailing')
				.where('mailing.id = :arg_id', { arg_id: id })
				.getOne()

			if (!mailing) {
				return responseJSON(false, 'mailing_not_exist', 'Mailing no existe', [])
			}
			const fileMailing = await fs.readFileSync(`${uploadsPath}\\mailing_generated\\${mailing.id}.html`, 'utf8')
			// const resultMail = await sendMailExternal('Probando de Probando', to, fileMailing)
			const resultMail = await sendEmailPOST()
			console.log('resultMail :>> ', resultMail)

			return responseJSON(true, 'mailing_sent', 'Correo electronico fue enviado.', { id: id, result_mail: resultMail }, 200)
		} catch {
			return responseJSON(false, 'mailing_not_found', 'Mailing no encontrado', [])
		}
	}

	async read (req : Request) {
		const { id } = req.params

		if (!id) {
			return responseJSON(false, 'missing_parameters', 'Faltan parametros', ['id'])
		}

		const mailing = await getRepository(Mailing).createQueryBuilder('mailing')
			.where('mailing.id = :arg_id', { arg_id: id })
			.getOne()

		if (!mailing) {
			return responseJSON(true, 'mailing_not_exist', 'Mailing no existe', [id])
		}

		try {
			const base64 = await fs.readFileSync(`${uploadsPath}\\mailing_generated\\${mailing.id}.html`, 'base64')
			return responseJSON(true, 'mailing_sent', 'Mailing enviado', { id: id, base64 }, 200)
		} catch {
			return responseJSON(true, 'mailing_not_found', 'Mailing no encontrado', [])
		}
	}
}
