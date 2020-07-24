// eslint-disable-next-line no-unused-vars
import { Request } from 'express'
import formidable from 'formidable'
import { IResponsePromise } from '../interface/IPromise'
// import fs from 'fs'
// const dirPath = path.join(__dirname, '..\\resource')

export const formRequest = (req : Request) : Promise<IResponsePromise> => {
	return new Promise((resolve) => {
		const form = new formidable.IncomingForm()
		form.parse(req, async function (err, fields, files) {
			if (err) {
				// eslint-disable-next-line prefer-promise-reject-errors
				resolve({ error: true, result: 'error_parse_file', message: 'Error al parsear el Archivo' })
			}

			if (!files.fileCSV.path) {
				resolve({ error: true, result: 'parameters_missing', message: 'Archivo \'fileCSV\' no encontrado' })
			}

			// const oldpath = files.fileCSV.path
			// const newpath = `${dirPath}\\upload\\buffer.csv`
			// await fs.copyFileSync(oldpath, newpath)

			resolve({ error: false, result: 'success', message: 'success', body: { file: files.fileCSV.path } })
		})
	})
}

export const parseRequest = (req : Request) : Promise<IResponsePromise> => {
	return new Promise((resolve) => {
		const form = new formidable.IncomingForm()
		form.parse(req, async function (err, fields, files) {
			if (err) {
				resolve({ error: true, result: err.toString(), message: 'Error al parsear el Archivo' })
			}

			resolve({ error: false, result: 'success', message: 'success', body: { fields, files } })
		})
	})
}
