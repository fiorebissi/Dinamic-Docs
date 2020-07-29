import { MailingController } from '../controller/MailingController'

export const routesMailing = [
	{
		method: 'post',
		route: '/mailing',
		controller: MailingController,
		action: 'createMany'
	},
	{
		method: 'post',
		route: '/mailing/create-and-send',
		controller: MailingController,
		action: 'createAndSend'
	},
	{
		method: 'post',
		route: '/mailing/create-and-send-addDocument',
		controller: MailingController,
		action: 'createAndSendAddDocument'
	},
	{
		method: 'post',
		route: '/mailing/send',
		controller: MailingController,
		action: 'sendMany'
	},
	{
		method: 'get',
		route: '/mailing/encrypted/:encrypted/:id',
		controller: MailingController,
		action: 'readEncrypted'
	}
]
