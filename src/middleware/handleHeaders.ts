// eslint-disable-next-line no-unused-vars
import { Request, Response, NextFunction } from 'express'

export const handleHeaders = (err : Error, req : Request, res : Response, next : NextFunction) => {
	if (err) {
		res.status(415).json({
			status: 415,
			result: 'error',
			message: 'Error en Cabeceras o JSON'
		})
	} else {
		next()
	}
}

export const errorHandler = (err : Error, req : Request, res : Response, next : NextFunction) => {
	res.status(500)
	res.render('error', { error: err })
}
