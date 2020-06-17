// eslint-disable-next-line no-unused-vars
import fs, { PathLike } from 'fs'
import csv from 'csv-parse'

export const readExcel = (pathAndExcel : PathLike, columns : Array<String>) => {
	const data : any = []
	return new Promise((resolve, reject) => {
		fs.createReadStream(pathAndExcel, { encoding: 'utf8' })
			.pipe(csv({ delimiter: ';' }))
			.on('data', (row) => {
				if (row.length !== columns.length) {
				// eslint-disable-next-line prefer-promise-reject-errors
					reject('El archivo debe estar separado por: punto y coma')
				}
				const oneData : any = {}
				for (let i = 0; i < row.length; i++) {
					oneData[`${columns[i]}`] = row[i]
				}
				data.push(oneData)
			})
			.on('end', () => {
				resolve(data)
			})
	})
}

export const encodeBasic = function (username: String, password: String) {
	return Buffer.from(`${username}:${password}`).toString('base64')
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
