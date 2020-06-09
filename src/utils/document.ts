import fs from 'fs'
import path from 'path'
import yazl from 'yazl'
const uploadsPath = path.join(__dirname, '..\\..\\uploads')

export const createDocument = async (pathDocument : string, template : string, varibles : Array<any>, base64 : boolean) : Promise<any> => {
	try {
		const htmlOK = await replaceAll(template, varibles)
		await fs.writeFileSync(pathDocument, htmlOK)
		return base64 ? await fs.readFileSync(pathDocument, 'base64') : 'success'
	} catch {
		return null
	}
}

export const replaceAll = (str : string, map : Array<any>) => {
	for (const key in map) {
		str = str.replace(new RegExp(key, 'g'), map[key])
	}
	return str
}

export const createOne = async (id : Number, oneData : any, dataTemplate : string) : Promise<any> => {
	try {
		const document = `${uploadsPath}\\document_generated\\${id}.html`
		return await createDocument(document, dataTemplate, oneData, true)
	} catch (error) {
		console.log('error.message :>> ', error.message)
		return null
	}
}

export const createMany = async (id : Number, objectJSON : Array<any>, dataTemplate : string) : Promise<any> => {
	try {
		const newDirectory = `${uploadsPath}\\document_generated\\${id}`
		await fs.mkdirSync(newDirectory)
		let i = 0
		const errors = []
		for await (const oneData of objectJSON) {
			const result = await createDocument(`${newDirectory}\\${i++}.html`, dataTemplate, oneData, false)
			if (!result) {
				errors.push(oneData)
			}
		}

		return errors
	} catch (error) {
		console.log('error.message :>> ', error.message)
		return null
	}
}

export const createZIP = async (directoryToZip : String) => {
	return console.log('directoryToZip :>> ', directoryToZip)
	/*
	const files = await fs.readdirSync(`${uploadsPath}\\document_generated\\${directoryToZip}`)
	const zipfile = new yazl.ZipFile()

	for await (const file of files) {
		zipfile.addFile(`${__dirname}\\..`, 'asd.js')
	}

	zipfile.outputStream.pipe(fs.createWriteStream(`${uploadsPath}\\document_generated\\${directoryToZip}.zip`)).on('close', function () {
		console.log('done')
	})

	zipfile.end()
	*/
}
