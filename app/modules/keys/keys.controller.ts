import * as restify from 'restify';
import { InternalServerError, NotFoundError } from 'restify-errors';
import IController from '../../interfaces/utils/IController';
import IRequest from '../../interfaces/utils/IServer';
import Key from '../../models/key.model';
import { IKey } from '../../interfaces/models';

export default class KeysController implements IController {
  public async post(req: IRequest, res: restify.Response, next: restify.Next) {
    try {
      const keyObj: IKey = req.body;
      keyObj.client_id = req.client_id;

      const key = <IKey> await Key.create(keyObj);

      return res.send({
        success: true,
        key_id: key.id,
        message: 'Key saved successfully!'
      });
    } catch (e) {
      throw new InternalServerError(e);
    }
    return next();
  }

  public async get(req: IRequest, res: restify.Response, next: restify.Next) {
    try {
      const id: number = req.params.key_id;
      const client_id = req.client_id;

      const key = <IKey> await Key.findOne({ where: { id, client_id } });

      if (!key) {
        return res.send(new restify.NotFoundError('Key not found for given credentials'));
      }

      return res.send({
        id: key.id,
        encrypted_key: key.encrypted_key,
        created_at: key.created_at,
        user_id: key.user_id
      });
    } catch (e) {
      throw new InternalServerError(e);
    }
    return next();
  }
}
