import * as restify from 'restify';
import { compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { InternalServerError } from 'restify-errors';
import IController from '../../../interfaces/utils/IController';
import User from '../../../models/user.model';
import { IUser } from '../../../interfaces/models';
import { config } from '../../../../config/env';
import { IRequest, IResponse } from '../../../interfaces/utils/IServer';

export default class LoginController implements IController {
  public async post(req: IRequest, res: IResponse, next: restify.Next) {
    try {
      const { email, password } = req.body;
      const user = <IUser> await User.findOne({ where: <IUser>{ email } });
      if (!user) {
        return res.send({ error: true, message: 'Email or password doesnt match' });
      }

      if (!compareSync(password, user.password)) {
        return res.send({ error: true, message: 'Email or password doesnt match' });
      }
      return res.send({
        access_token: sign({ id: user.id }, config.jwtSecret),
        user: { id: user.id, auth_provider: user.auth_provider }
      });
    } catch (e) {
      req.log.error(e);
      return res.send(new InternalServerError(e));
    }
    return next();
  }
}
