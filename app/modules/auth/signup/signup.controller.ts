import * as restify from 'restify';
import { hash } from 'bcrypt';
import { InternalServerError } from 'restify-errors';
import IController from '../../../interfaces/utils/IController';
import User from '../../../models/user.model';
import { IUser } from '../../../interfaces/models';
import { IRequest, IResponse } from '../../../interfaces/utils/IServer';

export default class SignupController implements IController {
  public async post(req: IRequest, res: IResponse, next: restify.Next) {
    try {
      const body = req.body;
      const user = <IUser> await User.findOne({ where: { email: body.email } });
      if (user) {
        return res.send({ error: true, message: 'A User with this email already exist.' });
      }

      const passwordHash = await hash(body.password, 12);

      await User.create({ ...body, password: passwordHash, auth_provider: 'EMAIL' });
      return { success: true, message: 'User created successfully' };
    } catch (e) {
      req.log.error(e);
      return res.send(new InternalServerError(e));
    }
    return next();
  }
}
