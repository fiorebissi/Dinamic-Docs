// eslint-disable-next-line no-unused-vars
import express, { Request, Response, NextFunction } from 'express'
import { Routes } from './routes'
import { createConnection } from 'typeorm'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import path from 'path'
require('dotenv').config({ path: '../.env' })
export const app = express()

createConnection().then(async (connection: { name: any }) => {
  app.use(express.urlencoded({ extended: false }))
  app.use(express.json({}))
  app.use(helmet())
  app.use(cookieParser(process.env.SECRET_KEY))
  // app.use(cors({ origin: ['http://www.dynamicdoc.com.ar', '201.212.176.171'], credentials: true }))
  app.use(cors({ origin: true, credentials: true }))
  app.use('/dd/static/resource', express.static(path.join(__dirname, '../public')))

  app.use((err : Error, req : Request, res : Response, next : NextFunction) => {
    if (err) {
      res.status(415).json({
        status: 415,
        result: 'error',
        message: 'crack, no sabes hacer un request'
      })
    } else {
      next()
    }
  })

  Routes.forEach(oneRoute => {
    (app as any)[oneRoute.method](`/dd${oneRoute.route}`,
      (req: Request, res: Response, next: NextFunction) => {
        const result = new (oneRoute.controller as any)()[oneRoute.action](req, res, next)
        if (result instanceof Promise) {
          result.then(result => result !== null && result !== undefined ? res.status(result.status || 200).send(result) : undefined)
        } else if (result !== null && result !== undefined) {
          console.log('Here!!!')
          res.json(result)
        }
      }
    )
  })

  const server = app.listen(process.env.PORT || 3000, function () {
    console.info(`
    WS Listening... in port ${server.address().port}`)
  })

  // En node v14 enviara una respuesta mejor.
  // Podremos especificar el encoding y callback.
  server.on('clientError', (err, socket) => {
    console.error(err)
    socket.end('HTTP/1.1 401 Bad Request\r\n\r\n')
  })
}).catch((error: any) => console.log(error))
