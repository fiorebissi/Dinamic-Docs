import fs from 'fs'

export const createDocument = async (pathDocument : string, template : string, varibles : Array<any>) : Promise<any> => {
  try {
    const htmlOK = await replaceAll(template, varibles)
    await fs.writeFileSync(pathDocument, htmlOK)
    return await fs.readFileSync(pathDocument, 'base64')
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
