import * as restify from 'restify';
import { hash } from 'bcrypt';
import { v1, v4 } from 'node-uuid';
import hat from 'hat';
import { InternalServerError } from 'restify-errors';
import IController from '../../interfaces/utils/IController';
import User from '../../models/user.model';
import App from '../../models/app.model';
import { IUser, IApp } from '../../interfaces/models';

export default class AppsController implements IController {
  public async post(req: any, res: restify.Response, next: restify.Next) {
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
      throw new InternalServerError(e);
    }
    return next();
  }

  public async getAll(req: any, res: restify.Response, next: restify.Next) {
    const userId: number = req.decoded.user_id;
    try {
      const apps = (
        await App.findAll({ where: { user_id: userId } })
      ).map((app: IApp) => {
        const { client_secret, user_id, ...rest } = app;
        return { ...rest };
      });
      return res.send(apps);
    } catch (e) {
      throw new InternalServerError(e);
    }
    return next();
  }
}
