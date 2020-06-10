import http from 'http'
import querystring from 'querystring'

/**
 *
 * @param {JSON} postData Es toda la informacion que se enviara al servidor
 * @param {JSON} options Son los parametros para la peticion (hostname,path,method,headers,otros...)
 * @param {function} callback Es la funciona que realizara la accion luego de culminar la peticion al sevidor
 */
export const requestPOST = (data : any, options : any, callback : Function) => {
  let dataWS = ''
  const postData = querystring.stringify(data)
  const req = http.request(options, (res : any) => {
    res.setEncoding('utf8')

    res.on('data', (chunk : any) => {
      dataWS += chunk
    })

    res.on('end', () => {
      try {
        const parsedData = JSON.parse(dataWS)
        callback(null, parsedData)
      } catch (e) {
        callback(e.message, null)
      }
    })
  })

  req.on('error', (e) => {
    callback(e.message, null)
  })

  req.write(postData)
  req.end()
}

/**
 *
 * @param {JSON} options Son los parametros para la peticion (hostname,path,method,headers,otros...)
 * @param {function} callback Es la funciona que realizara la accion luego de culminar la peticion al sevidor
*/
export const requestGET = (postData : JSON, options : any, callback : Function) => {
  let dataWS = ''
  const req = http.request(options, (res) => {
    res.setEncoding('utf8')

    res.on('data', (chunk) => {
      dataWS += chunk
    })

    res.on('end', () => {
      try {
        const parsedData = JSON.parse(dataWS)
        callback(null, parsedData)
      } catch (e) {
        callback(e.message, null)
      }
    })
  })

  req.on('error', (e) => {
    callback(e.message, null)
  })
  req.end()
}
