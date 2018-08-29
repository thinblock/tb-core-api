import * as restify from 'restify';
import { hash } from 'bcrypt';
import { InternalServerError } from 'restify-errors';
import IController from '../../../interfaces/utils/IController';
import User from '../../../models/user.model';
import UserSettings from '../../../models/user_setting.model';
import { IUser, IUserSettings } from '../../../interfaces/models';
import { IRequest, IResponse } from '../../../interfaces/utils/IServer';

export default class SignupController implements IController {
  public async post(req: IRequest, res: IResponse, next: restify.Next) {
    try {
      // add parameter to enable 2FA
      const body = req.body;
      const user = <IUser> await User.findOne({ where: { email: body.email } });
      if (user) {
        return res.send({ error: true, message: 'A User with this email already exist.' });
      }

      const passwordHash = await hash(body.password, 12);

      const returnUser = <IUser> await User.create({
        ...body, password: passwordHash, auth_provider: 'EMAIL'
      });

      const settings = <IUserSettings> await UserSettings.create({
        user_id: returnUser.id, enable_otp: false, phone: ''
      });

      return { success: true, message: 'User created successfully' };
    } catch (e) {
      req.log.error(e);
      return res.send(new InternalServerError(e));
    }
    return next();
  }
}
