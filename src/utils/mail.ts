
import nodemailer from 'nodemailer'
import axios from 'axios'

export const sendMail = async (toEmail : string, html : string) : Promise<Object> => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: '192.168.0.15',
    port: 25,
    secure: false
  })

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Ramon Chozas" <contacto@documentosdinamicos.com.ar>', // sender address
    to: toEmail, // list of receivers
    subject: 'Documentos Dinamicos', // Subject line
    html: html // html body
  })

  return info
}

export const sendMailExternal = (toClient : string, toEmail : string, html : string) => {
  const htmlToBase64 = Buffer.from(`${html}`).toString('base64')

  return axios({
    method: 'post',
    url: 'http://ticketsymarbetes.com.ar/sendMailClient.php',
    data: {
      client: toClient,
      email: toEmail,
      html: htmlToBase64
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((objEnd) => {
      const { data } = objEnd

      console.log(data)
      return true
    }).catch(function (error) {
      console.log(`Error_1= ${error}`)
      return false
    })
}
