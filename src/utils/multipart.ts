// eslint-disable-next-line no-unused-vars
import { Request } from 'express'
import formidable from 'formidable'
// import fs from 'fs'
// const dirPath = path.join(__dirname, '..\\resource')

export const formRequest = (req : Request) => {
	return new Promise((resolve, reject) => {
		const form = new formidable.IncomingForm()
		form.parse(req, async function (err, fields, files) {
			if (err) {
				console.info(err)
				// eslint-disable-next-line prefer-promise-reject-errors
				reject({ result: 'error_parse_file', message: 'Error al parsear el Archivo' })
			}

			if (!files.fileCSV.path) {
				// eslint-disable-next-line prefer-promise-reject-errors
				reject({ result: 'parameters_missing', message: 'Archivo \'fileCSV\' no encontrado' })
			}

			// const oldpath = files.fileCSV.path
			// const newpath = `${dirPath}\\upload\\buffer.csv`
			// await fs.copyFileSync(oldpath, newpath)

			resolve(files.fileCSV.path)
		})
	})
}

export const parseRequest = (req : Request) => {
	return new Promise((resolve, reject) => {
		const form = new formidable.IncomingForm()
		form.parse(req, async function (err, fields, files) {
			if (err) {
				console.info(err)
				// eslint-disable-next-line prefer-promise-reject-errors
				reject({ result: 'error_parse_file', message: 'Error al parsear el Archivo' })
			}

			resolve({ result: 'success', fields, files })
		})
	})
}
