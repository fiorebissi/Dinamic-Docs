// eslint-disable-next-line no-unused-vars
import { Request, Response, NextFunction } from 'express'
import axios from 'axios'
import { decodeBasic, encodeBasic } from '../utils/myUtils'
import { responseJSON } from '../utils/responseUtil'
import { createToken, validToken, tokenInHeader } from '../utils/Token'

export class SecurityController {
	async login (req: Request, res: Response) {
		const { authorization } = req.headers

		if (!authorization) {
			return responseJSON(false, 'credentials-missing', 'Falta cabecera de autorizacion', [])
		}

		const { alias, contraseña } = decodeBasic(authorization)

		if (!alias || !contraseña) {
			return responseJSON(false, 'authorization-invalid', 'Autorizacion mal generada.', [])
		}

		return axios({
			method: 'post',
			data: {
				id: process.env.CLIENT_ID,
				client: process.env.CLIENT_SECRET
			},
			url: 'http://www.husaresfacil.com.ar/node_auth_server/login',
			headers: {
				Authorization: `Basic ${await encodeBasic(alias, contraseña)}`,
				'Content-Type': 'application/json'
			}
		})
			.then((body) => body.data)
			.catch(() => responseJSON(false, 'error_internal_wsa', 'Error Interno. WSA', [], 500))
			.then(async (objUsuario) => {
				const { id, alias: username, role, nombre: firstName, apellido: lastName } = objUsuario.body

				if (!id || !username || !role) {
					return responseJSON(false, 'error_internal_wsa', 'Error en usuario', [], 200)
				}

				const token = await createToken({
					sub: 'login', aud: 'web', id: id, role, usn: username
				})
				await tokenInHeader(res, token)

				return responseJSON(true, 'user_loged', 'Usuario Logeado', { user: { firstName, lastName } }, 200)
			})
			.catch(() => responseJSON(false, 'error_internal', 'Error Interno.', [], 500))
	}

	async valid (req: Request, res: Response, next: NextFunction) {
		const { authorization } = req.headers

		const objToken = await validToken(authorization)

		if (!objToken) {
			return responseJSON(false, 'token_invalid', 'Token Invalido.', [], 401)
		}

		req.body.jwt_usuario_id = objToken.id
		req.body.jwt_usuario_role = objToken.role
		req.body.jwt_usuario_username = objToken.usn

		const newToken = await createToken({
			sub: 'update', aud: 'web', id: objToken.id, role: objToken.role, usn: objToken.usn
		})
		await tokenInHeader(res, newToken)
		next()
	}

	async validInCookie (req: Request, res: Response, next: NextFunction) {
		const { hr_rch: token } = req.signedCookies
		if (!token) {
			return responseJSON(false, 'token_missing', 'Acceso Denegado. Sin Token.', [], 401)
		}

		const objToken = await validToken(token)

		if (!objToken) {
			return responseJSON(false, 'token_invalid', 'Token Invalido.', [], 401)
		}

		req.body.jwt_usuario_id = objToken.id
		req.body.jwt_usuario_role = objToken.role
		req.body.jwt_usuario_username = objToken.usn

		const newToken = await createToken({
			sub: 'update', aud: 'web', id: objToken.id, role: objToken.role, usn: objToken.usn
		})
		await tokenInHeader(res, newToken)
		next()
	}

	async expired (req: Request) {
		const {
			jwt_usuario_username: jwtUsername, username, contraseña, nuevaContraseña, confirmaContraseña
		} = req.body

		if (!username || username.length < 1 || username !== jwtUsername) {
			return responseJSON(false, 'error_username', "Parametro 'username' es invalido.", [])
		}

		if (!contraseña || contraseña.length < 1) {
			return responseJSON(false, 'error_password', "Parametro 'contraseña' es invalido.", [])
		}

		if (!nuevaContraseña || nuevaContraseña.length < 1) {
			return responseJSON(false, 'error_newPassword', "Parametro 'nuevaContraseña' es invalido.", [])
		}

		if (!confirmaContraseña || confirmaContraseña.length < 1) {
			return responseJSON(false, 'error_confirmPassword', "Parametro 'confirmaContraseña' es invalido.", [])
		}

		const regex = new RegExp(/^(?=.*\d)(?=.*[a-záéíóúüñ]).*[A-ZÁÉÍÓÚÜÑ]/, 'g')

		if (nuevaContraseña.length < 6 || regex.test(nuevaContraseña) === false) {
			return responseJSON(false, 'password_not_secure', 'Contraseña Insegura.', [])
		}

		if (nuevaContraseña !== confirmaContraseña) {
			return responseJSON(false, 'password_not_match', 'Contraseñas no coinciden.', [])
		}

		return axios({
			method: 'post',
			url: 'http://www.husaresfacil.com.ar/node_auth_server/expired',
			data: {
				grant_type: 'authentication_use',
				username,
				contraseña,
				nuevaContraseña,
				confirmaContraseña
			},
			headers: {
				Authorization: `Bearer ${username}`,
				'Content-Type': 'application/json'
			}
		})
			.then((body) => body.data)
			.catch((error) => {
				console.info(error.data)
				return responseJSON(false, 'error_interal', 'Error Interno. WSA', [], 500)
			}).then(async (objResult) => {
				const { result, message, status } = objResult.body

				if (result !== 200) {
					return responseJSON(false, 'error_internal_wsa', message, [], status)
				}
				return responseJSON(true, 'password_updated', 'Contraseña Modificada.', [], 200)
			})
			.catch((error) => {
				console.info(error)
				return responseJSON(false, 'error_internal', 'Error Interno.', [], 500)
			})
	}
}
