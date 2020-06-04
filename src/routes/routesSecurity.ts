import { SecurityController } from '../controller/SecurityController'

export const routesSecurity = [
  {
    method: 'post',
    route: '/login',
    controller: SecurityController,
    action: 'login'
  }
  /*
  ,
  {
    method: 'post',
    route: '/register',
    controller: SecurityController,
    action: 'register'
  }, {
    method: 'post',
    route: '/forget',
    controller: SecurityController,
    action: 'forget'
  }, {
    method: 'all',
    route: '*',
    controller: SecurityController,
    action: 'validInCookie'
  }, {
    method: 'put',
    route: '/expired',
    controller: SecurityController,
    action: 'expired'
  }
  */
]
