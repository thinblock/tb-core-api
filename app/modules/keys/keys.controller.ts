import * as restify from 'restify';
import { InternalServerError, NotFoundError } from 'restify-errors';
import IController from '../../interfaces/utils/IController';
import { IRequest, IResponse } from '../../interfaces/utils/IServer';
import { ActivityLogEvents } from '../../interfaces/enums';
import Key from '../../models/key.model';
import { IKey } from '../../interfaces/models';

export default class KeysController implements IController {
  public async post(req: IRequest, res: IResponse, next: restify.Next) {
    try {
      const keyObj: IKey = req.body;
      keyObj.client_id = req.client_id;

      const key = <IKey> await Key.create(keyObj);

      req.activityLog(
        req.client_id, 'Key added successfully',
        ActivityLogEvents.USER_ENCRYPTED_KEY_ADDED,
        req.body.user_id, { id: key.id }
      );

      return res.send({
        success: true,
        key_id: key.id,
        message: 'Key saved successfully!'
      });
    } catch (e) {
      req.log.error(e);
      throw new InternalServerError(e);
    }
    return next();
  }

  public async get(req: IRequest, res: IResponse, next: restify.Next) {
    try {
      const id: number = req.params.key_id;
      const client_id = req.client_id;

      const key = <IKey> await Key.findOne({ where: { id, client_id } });

      if (!key) {
        return res.send(new NotFoundError('Key not found for given credentials'));
      }

      return res.send({
        id: key.id,
        encrypted_key: key.encrypted_key,
        created_at: key.created_at,
        user_id: key.user_id
      });
    } catch (e) {
      req.log.error(e);
      throw new InternalServerError(e);
    }
    return next();
  }
}
