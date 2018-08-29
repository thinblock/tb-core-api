import * as restify from 'restify';
import { compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { InternalServerError } from 'restify-errors';
import IController from '../../../interfaces/utils/IController';
import User from '../../../models/user.model';
import { UserStatuses } from '../../../interfaces/enums';
import { IUser, IUserSettings, IPhoneVerification } from '../../../interfaces/models';
import { config, env } from '../../../../config/env';
import { IRequest, IResponse } from '../../../interfaces/utils/IServer';
import { oneLine } from 'common-tags';
import UserSetting from '../../../models/user_setting.model';
import * as OTP from '../../../../utils/otp/otp';

export default class LoginController implements IController {
  public async post(req: IRequest, res: IResponse, next: restify.Next) {
    try {
      const { email, password } = req.body;
      const user = <IUser> await User.findOne(
        {
          where: { email },
          include: [
            {
              model: UserSetting,
              as: 'settings'
            }
          ]
        },
      );

      if (!user) {
        return res.send({ error: true, message: 'Email or password doesnt match' });
      }

      if (user.status === UserStatuses.SUSPENDED) {
        return res.send({
          error: true,
          message: oneLine`
            Your account was suspended for security reasons. Please
            reset your account password to regain access to your account
          `
        });
      } else if (user.status === UserStatuses.BLOCKED) {
        return res.send({
          error: true,
          message: oneLine`
            Your account has been blocked for security reasons.
          `
        });
      }

      if (!compareSync(password, user.password)) {
        // incorrect password
        const createdDate = new Date(user.login_attempt_time).valueOf();
        const currentDate = Date.now();
        const diff = (currentDate - createdDate) / 1000;

        if (user.login_attempts > -1 && user.login_attempts < 4 && diff < 3600) {
          // if login_attempts greater than -1 less than 4
          // if difference less than 1 hr
          // increment login_attempts
          await User.update(
            { login_attempts: user.login_attempts + 1, login_attempt_success: false },
            { where: { id: user.id } }
          );
          return res.send({ error: true, message: 'Email or password doesnt match' });
        }

        if (user.login_attempts > -1 && user.login_attempts < 4 && diff > 3600) {
          // if login_attempts greater than -1 less than 4
          // if difference greater than 1 hr
          // reset login_attempts, login_attempt_time
          await User.update(
            { login_attempts: 0, login_attempt_time: Date.now() },
            { where: { id: user.id } }
          );
          return res.send({ error: true, message: 'Email or password doesnt match' });
        }

        if (user.login_attempts === 4 && diff < 3600) {
          // if login_attempts equals 4
          // if difference less than 1 hr
          // block user
          await User.update(
            { login_attempts: 0, login_attempt_time: Date.now(), status: UserStatuses.BLOCKED },
            { where: { id: user.id } }
          );
          return res.send({ error: true, message: 'User has been blocked' });
        }
      } else {
        if (user.settings.enable_otp) {
          // correct password && enable_otp
          const response = await OTP.createPhoneCode(user.settings.phone, user.id);

          await User.update(
            {
              login_attempts: 0,
              login_attempt_time: Date.now(),
              login_attempt_success: true
            },
            {
              where: { id: user.id }
            }
          );

          if (env !== 'production') {
            return res.send({
              user: { id: user.id, phone: user.settings.phone, otp: response.otp },
              message: 'Sent OTP'
            });
          } else {
            return res.send({
              user: { id: user.id, phone: user.settings.phone },
              message: 'Sent OTP'
            });
          }
        } else {
          // correct password && !enable_otp
          await User.update(
            {
              login_attempts: 0,
              login_attempt_time: Date.now(),
              login_attempt_success: true
            },
            {
              where: { id: user.id }
            }
          );
          return res.send({
            access_token: sign({ id: user.id }, config.jwtSecret),
            user: { id: user.id, auth_provider: user.auth_provider }
          });
        }
      }
    } catch (e) {
      console.log(e);
      req.log.error(e);
      return res.send(new InternalServerError(e));
    }
    return next();
  }
}
