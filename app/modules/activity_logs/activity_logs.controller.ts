import * as restify from 'restify';
import { InternalServerError } from 'restify-errors';
import IController from '../../interfaces/utils/IController';
import ActivityLog from '../../models/activity_log.model';
import { IActivityLog } from '../../interfaces/models';
import { IRequest, IResponse } from '../../interfaces/utils/IServer';

export default class ActivityLogsController implements IController {
  public async get(req: IRequest, res: IResponse, next: restify.Next) {
    const client_id = req.client_id;
    const user_id: string = req.query.user_id;
    const findObj = {
      client_id, user_id
    };

    if (!user_id) {
      delete findObj.user_id;
    }

    try {
      // TODO: need to add pagination
      const logs = <IActivityLog[]> await ActivityLog.findAll({
        where: findObj,
        attributes: { exclude: ['data', 'client_id'] }
      });

      return res.send({ result: logs });
    } catch (e) {
      req.log.error(e);
      throw new InternalServerError(e);
    }
  }
}
