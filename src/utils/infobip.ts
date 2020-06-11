
import axios from 'axios'
import querystring from 'querystring'
import { encodeBasic } from '../utils/myUtils'

export const loginInfobip = (username: String, password: String) : Promise<String> => {
	return axios({
		method: 'POST',
		url: 'https://zp4d6.api.infobip.com/auth/1/session',
		headers: {
			Authorization: `Basic ${encodeBasic(username, password)}`,
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		data: JSON.stringify({ username, password })
	})
		.then((body) => body.data)
		.catch(() => null)
		.then((objRes) => {
			if (!objRes.token) {
				return null
			}
			return objRes.token
		})
		.catch(() => null)
}

export const sendSmsPOST = (numberPhone: String, message : String, token: String) : Promise<Object> => {
	return axios({
		method: 'POST',
		url: 'https://zp4d6.api.infobip.com/sms/2/text/advanced',
		headers: {
			Authorization: `IBSSO ${token}`,
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		data: JSON.stringify({
			tracking: { track: 'SMS', type: 'MY_DD' },
			messages: [{
				from: 'InfoSMS',
				destinations:
          [
          	{ to: numberPhone }
          ],
				text: message,
				flash: true,
				language: {
					languageCode: 'ES'
				}
			}]
		})
	})
		.then((body) => body.data)
		.catch(() => null)
		.then((objRes) => objRes.messages)
		.catch(() => null)
}

export const sendSmsGET = (numberPhone: String, message : String, username: String, password: String) : Promise<Object> => {
	const parameters = querystring.stringify({ username: username, password: password, from: 'InfoSMS', to: numberPhone, text: message })
	return axios({
		method: 'GET',
		url: `https://zp4d6.api.infobip.com/sms/1/text/query?${parameters}`,
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	})
		.then((body) => body.data)
		.catch(() => null)
		.then((objRes) => objRes.messages)
		.catch(() => null)
}

export const sendEmailPOST = (token?: String) : Promise<Object> => {
	if (!process.env.USER_INFOBIP || !process.env.PASSWORD_INFOBIP) {
		const message = { error: 'sin credenciales', user: process.env.USER_INFOBIP, password: process.env.PASSWORD_INFOBIP }
		return Promise.reject(message)
	}

	return axios({
		method: 'POST',
		url: 'https://zp4d6.api.infobip.com/email/2/send',
		headers: {
			Authorization: `Basic ${encodeBasic(process.env.USER_INFOBIP, process.env.PASSWORD_INFOBIP)}`,
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		maxRedirects: 20,
		data: JSON.stringify({
			from: 'Jane Smith <jane.smith@somecompany.com>',
			to: 'arodriguez@rchozas.com.ar',
			replyTo: 'all.replies@somedomain.com',
			subject: 'Mail subject text',
			text: 'Mail body text',
			html: '<h1>Html body</h1><p>Rich HTML message body.</p>'
		})
	})
		.then((body) => {
			console.log('body.data :>> ', body.data)
			return body.data
		})
		.catch((error) => {
			console.log('error :>> ', error)
			return null
		})
		.then((objRes) => objRes.messages)
		.catch(() => null)
}
