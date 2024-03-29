import { DocumentController } from '../controller/DocumentController'

export const routesDocument = [
	{
		method: 'post',
		route: '/document',
		controller: DocumentController,
		action: 'create'
	},
	{
		method: 'post',
		route: '/document/excel',
		controller: DocumentController,
		action: 'receiveExcel'
	},
	{
		method: 'post',
		route: '/document/send-sms',
		controller: DocumentController,
		action: 'sendSMS'
	},
	{
		method: 'post',
		route: '/document/send-many-sms',
		controller: DocumentController,
		action: 'sendManySMS'
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
	},
	{
		method: 'get',
		route: '/document/encrypted/:encrypted/:id/view',
		controller: DocumentController,
		action: 'readAndView'
	}
]
