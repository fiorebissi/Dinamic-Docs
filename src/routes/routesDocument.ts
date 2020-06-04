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
    method: 'get',
    route: '/document/:id',
    controller: DocumentController,
    action: 'read'
  },
  {
    method: 'get',
    route: '/document/encrypt/:encrypted_id',
    controller: DocumentController,
    action: 'readEncrypt'
  }
]
