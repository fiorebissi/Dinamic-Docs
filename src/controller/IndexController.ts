// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express'
import { responseJSON } from '../utils/responseUtil'

export class IndexController {
  async welcome (req: Request, res: Response) {
    return responseJSON(true, 'welcome', 'Welcome WS...', [], 200)
  }
}
