// eslint-disable-next-line no-unused-vars
import fs, { PathLike } from 'fs'
import csv from 'csv-parse'
interface Respuesta { error: string | null, data?: string | null}

export const readExcel = (pathAndExcel : PathLike, columns : Array<string>, delimiter : string) : Promise<Respuesta> => {
	const data : any = []
	return new Promise((resolve) => {
		fs.createReadStream(pathAndExcel, { encoding: 'utf8' })
			.pipe(csv({ delimiter }))
			.on('data', (row) => {
				if (row.length !== columns.length) {
					resolve({ error: `Envió ${row.length} columnas y se requieren ${columns.length}`, data: null })
				}
				const oneData : any = {}
				for (let i = 0; i < row.length; i++) {
					oneData[`${columns[i]}`] = row[i]
				}
				data.push(oneData)
			})
			.on('end', () => {
				resolve({ error: null, data })
			})
	})
}

export const encodeBasic = function (username: string, password: string) {
	return Buffer.from(`${username}:${password}`).toString('base64')
}

export const decodeBasic = function (autorizacion : String) {
	const [tipo, credenciales] = autorizacion.split(' ')

	if (!tipo || !credenciales || tipo !== 'Basic') {
		return { alias: null, contrseña: null }
	}

	const buffer = Buffer.from(credenciales, 'base64').toString('ascii')
	const [alias, contraseña] = buffer?.split(':')

	return {
		alias,
		contraseña
	}
}

export const generateRandomString = function (length: Number) {
	let randomString = ''
	const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

	for (let index = 0; index < length; index++) {
		randomString += possibleChars.charAt(
			Math.floor(Math.random() * possibleChars.length)
		)
	}

	return randomString
}

export const errorsToSnake = async (errores: Array<any>) => {
	const newArray = []

	for await (const rowErr of errores) {
		rowErr.property =

      newArray.push({ propiedad: rowErr.property.replace(/[A-Z]/g, (letter: any) => `_${letter.toLowerCase()}`), errores: Object.values(rowErr.constraints) })
	}
	return newArray
}

export const validAuthorization = (roleRequired: String, roleUser: String): boolean => {
	let roleNumber: Number

	switch (roleRequired) {
	case 'ROLE_VENDEDOR':
		roleNumber = 0
		break
	case 'ROLE_ADMIN':
		roleNumber = 10
		break
	default:
		roleNumber = -1
		break
	}

	switch (roleUser) {
	case 'ROLE_VENDEDOR':
		return roleNumber <= 0
	case 'ROLE_ADMIN':
		return roleNumber <= 10
	default:
		return false
	}
}
