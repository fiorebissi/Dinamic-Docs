import { IndexController } from '../controller/IndexController'

export const routesIndex = [
  {
    method: 'get',
    route: '/',
    controller: IndexController,
    action: 'welcome'
  }
]
