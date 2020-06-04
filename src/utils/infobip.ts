
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
