import * as restify from 'restify';
import Controller from '../interfaces/utils/Controller';
import { logger } from '../../utils/logger';

export default class ClassController implements Controller {
  public getAll(req: restify.Request, res: restify.Response, next: restify.Next) {
    logger.info('update class');
    res.json(200, 'update class');
    return next();
  }
}
