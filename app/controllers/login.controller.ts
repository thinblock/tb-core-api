import * as restify from 'restify';
import IController from '../interfaces/utils/IController';
import { logger } from '../../utils/logger';

export default class ClassController implements IController {
  public getAll(req: restify.Request, res: restify.Response, next: restify.Next) {
    logger.info('update class');
    res.json(200, 'update class');
    return next();
  }
}
