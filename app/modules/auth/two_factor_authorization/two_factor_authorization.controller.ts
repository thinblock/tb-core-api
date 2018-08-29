import * as restify from 'restify';
import { sign } from 'jsonwebtoken';
import { InternalServerError, NotFoundError } from 'restify-errors';
import IController from '../../../interfaces/utils/IController';
import User from '../../../models/user.model';
import UserSettings from '../../../models/user_setting.model';
import * as OTP from '../../../../utils/otp/otp';
import { UserStatuses } from '../../../interfaces/enums';
import { IUser } from '../../../interfaces/models';
import { config } from '../../../../config/env';
import { IRequest, IResponse } from '../../../interfaces/utils/IServer';

export default class TwoFactorAuthorizationController implements IController {
  public async post(req: IRequest, res: IResponse, next: restify.Next) {
    try {
      const { phone, otp } = req.body;

      const user = <IUser> await User.findOne({ where: { phone } });
      if (!user) {
        return res.send(new NotFoundError(`User doesn't exist in our db`));
      }

      const response = await OTP.verifyCode(otp, user.id);

      if (!response.success) {
        if (response.blocked) {
          await User.update(
            { status: UserStatuses.BLOCKED },
            { where: { id: user.id } }
          );
          return res.send({ error: true, message: response.message });
        } else {
          return res.send({ error: true, message: response.message });
        }
      } else {
        return res.send({
          access_token: sign({ id: user.id }, config.jwtSecret),
          user: { id: user.id, auth_provider: user.auth_provider }
        });
      }
    } catch (e) {
      console.log(e);
      req.log.error(e);
      return res.send(new InternalServerError(e));
    }
    return next();
  }
}
