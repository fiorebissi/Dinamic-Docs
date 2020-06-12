import { DocumentController } from '../controller/DocumentController'

export const routesDocument = [
	{
		method: 'post',
		route: '/document',
		controller: DocumentController,
		action: 'createHTML'
	},
	{
		method: 'post',
		route: '/document/excel/:name_template',
		controller: DocumentController,
		action: 'createExcel'
	},
	{
		method: 'post',
		route: '/document/send-sms',
		controller: DocumentController,
		action: 'sendSMS'
	},
	{
		method: 'get',
		route: '/document/:id',
		controller: DocumentController,
		action: 'read'
	},
	{
		method: 'get',
		route: '/document/encrypted/:encrypted/:id',
		controller: DocumentController,
		action: 'readEncrypted'
	}
]
