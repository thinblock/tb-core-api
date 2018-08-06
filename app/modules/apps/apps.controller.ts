import * as restify from 'restify';
import { hash } from 'bcrypt';
import { v4 } from 'node-uuid';
import * as hat from 'hat';
import { InternalServerError } from 'restify-errors';
import IController from '../../interfaces/utils/IController';
import App from '../../models/app.model';
import { IApp } from '../../interfaces/models';
import { IRequest, IResponse } from '../../interfaces/utils/IServer';

export default class AppsController implements IController {
  public async post(req: IRequest, res: IResponse, next: restify.Next) {
    const userId = req.decoded.user_id;
    try {
      const { name } = req.body;
      const Rack = hat.rack();
      const secret = Rack(); // Create client_secret
      const app = <IApp> await App.create(<IApp> {
        name,
        client_id: v4(),
        client_secret: await hash(secret, 12),
        user_id: userId,
      });

      return res.send({
        name: app.name,
        client_id: app.client_id,
        client_secret: secret
      });
    } catch (e) {
      req.log.error(e);
      throw new InternalServerError(e);
    }
    return next();
  }

  public async getAll(req: IRequest, res: IResponse, next: restify.Next) {
    const userId: number = req.decoded.user_id;
    try {
      const apps = (
        await App.findAll({ where: { user_id: userId } })
      ).map((app: IApp) => {
        const { id, client_id, created_at, name } = app;
        return { id, name, created_at, client_id };
      });
      return res.send(apps);
    } catch (e) {
      req.log.error(e);
      throw new InternalServerError(e);
    }
    return next();
  }
}
