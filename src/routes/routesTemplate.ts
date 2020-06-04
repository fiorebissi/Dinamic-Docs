import { TemplateController } from '../controller/TemplateController'

export const routesTemplate = [
  {
    method: 'get',
    route: '/template',
    controller: TemplateController,
    action: 'readAll'
  },
  {
    method: 'get',
    route: '/template/:name_template',
    controller: TemplateController,
    action: 'read'
  }
]
