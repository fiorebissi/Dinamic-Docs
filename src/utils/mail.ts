
import nodemailer from 'nodemailer'
import axios from 'axios'
// eslint-disable-next-line no-unused-vars
import Mail from 'nodemailer/lib/mailer'
// eslint-disable-next-line no-unused-vars
import { IMail, IResponseTransporter } from '../interface/IMail'
let transporter : Mail

export const createTransporter = async () : Promise<IResponseTransporter> => {
	if (transporter) {
		return { error: false, message: 'transporter existente' }
	}
	if (!process.env.MAILER_PORT || !process.env.MAILER_HOST) {
		return { error: true, message: 'credenciales invalidas' }
	}
	transporter = await nodemailer.createTransport({
		pool: true,
		host: process.env.MAILER_HOST,
		port: parseInt(process.env.MAILER_PORT),
		secure: false,
		tls: { rejectUnauthorized: false }
	})

	return { error: false, message: 'transporter creado' }
}

export const validTransporter = (cb : Function) => {
	let end : IResponseTransporter
	transporter.verify(function (error, success) {
		if (error) {
			end.error = true
			end.message = error.message
		} else {
			end.error = false
			end.message = 'error al validar '
		}
		cb(end)
	})
}

export const sendMail = async (messages : Array<IMail>) : Promise<IResponseTransporter> => {
	const { error, message } = await createTransporter()

	if (error) {
		return { error: true, message }
	}
	transporter.on('idle', () => {
		while (transporter.isIdle() && messages.length) {
			const message = messages.shift()
			if (message) {
				transporter.sendMail(message)
			}
		}
	})
	return { error: false, message: 'mail colocados en la cola' }
}

/**
 * Consume un "endpoint" realizado en PHP para enviar un mail.
 * @param toClient Es el cliente a quien le enviaremos el mail.
 * @param toEmail Es la dirrecion de correo a donde enviaremos el mail.
 * @param html Es el cuerpo HTML que tendra el mail.
 */
export const sendMailExternal = (toClient : string, toEmail : string, html : string) => {
	return axios('http://ticketsymarbetes.com.ar/sendMailDD.php', {
		method: 'POST',
		data: JSON.stringify({
			client: toClient,
			email: toEmail,
			html: html
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then((objEnd) => true)
		.catch(() => false)
}
