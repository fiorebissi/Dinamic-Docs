import { MailingController } from '../controller/MailingController'

export const routesMailing = [
	{
		method: 'post',
		route: '/mailing',
		controller: MailingController,
		action: 'create'
	},
	{
		method: 'post',
		route: '/mailing/create-and-send',
		controller: MailingController,
		action: 'createAndSend'
	},
	{
		method: 'post',
		route: '/mailing/send',
		controller: MailingController,
		action: 'send'
	},
	{
		method: 'get',
		route: '/mailing/encrypted/:encrypted/:id',
		controller: MailingController,
		action: 'readEncrypted'
	}
]
