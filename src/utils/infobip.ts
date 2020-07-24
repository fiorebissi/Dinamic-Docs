
import axios from 'axios'
import querystring from 'querystring'
import { encodeBasic } from '../utils/myUtils'

export const loginInfobip = () => {
	let token : any
	return async () => {
		if (token) {
			return token
		} else if (process.env.TOKEN_INFOBIP) {
			token = process.env.TOKEN_INFOBIP
			return token
		} else if (!process.env.USER_INFOBIP || !process.env.PASSWORD_INFOBIP) {
			return null
		}
		return axios({
			method: 'POST',
			url: 'https://zp4d6.api.infobip.com/auth/1/session',
			headers: {
				Authorization: `Basic ${encodeBasic(process.env.USER_INFOBIP, process.env.PASSWORD_INFOBIP)}`,
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			data: JSON.stringify({ username: process.env.USER_INFOBIP, password: process.env.PASSWORD_INFOBIP })
		})
			.then((body) => body.data)
			.catch(() => null)
			.then((objRes) => {
				if (!objRes.token) {
					return null
				}
				token = objRes.token
				return objRes.token
			})
			.catch(() => null)
	}
}

export const sendSmsPOST = (numberPhone: string, message : string, token: string) : Promise<Object> => {
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
          [{ to: numberPhone }],
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

export const sendManySmsPOST = (messages : Array<Object>, token: string) : Promise<Object> => {
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
			messages
		})
	})
		.then((body) => body.data)
		.catch(() => null)
		.then((objRes) => objRes.messages)
		.catch(() => null)
}

export const sendSmsGET = (numberPhone: string, message : string, username: string, password: string) : Promise<Object> => {
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

export const sendEmailPOST = (to: string, from : string, subject : string, html : string) : Promise<Object> => {
	if (!process.env.USER_INFOBIP || !process.env.PASSWORD_INFOBIP) {
		const message = { error: 'sin credenciales', user: process.env.USER_INFOBIP, password: process.env.PASSWORD_INFOBIP }
		return Promise.reject(message)
	}

	return axios('https://zp4d6.api.infobip.com/email/2/send', {
		method: 'POST',
		headers: {
			Authorization: `Basic ${encodeBasic(process.env.USER_INFOBIP, process.env.PASSWORD_INFOBIP)}`,
			'Content-Type': 'application/x-www-form-urlencoded',
			Accept: 'application/json'
		},
		data: JSON.stringify({
			from: from,
			to: to,
			subject: subject,
			html: html
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
