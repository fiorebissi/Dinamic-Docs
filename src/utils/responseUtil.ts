export const responseJSON = function (type: Boolean, result : String, message: String, body: Object, status?: number) {
	return {
		type: type ? 'success' : 'error',
		result: result,
		message: message,
		body: body,
		status: status
	}
}

export const responseFile = function (type: Boolean, result : String, message: String, body: Object, status?: number) {
	return {
		type: type ? 'success' : 'error',
		result: result,
		message: message,
		body: body,
		status: status
	}
}
