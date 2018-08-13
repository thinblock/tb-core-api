import * as restify from 'restify';
import { compareSync, hashSync } from 'bcrypt';
import { InternalServerError, NotFoundError } from 'restify-errors';
import IController from '../../../interfaces/utils/IController';
import User from '../../../models/user.model';
import { IUser } from '../../../interfaces/models';
import { config } from '../../../../config/env';
import { oneLine } from 'common-tags';
import { IRequest, IResponse } from '../../../interfaces/utils/IServer';
import { EmailTypes, UserStatuses } from '../../../interfaces/enums';
import { sendEmail } from '../../../../utils/email_service';
import { generatePasswordResetLink } from '../../../../utils/helpers';

export default class ResetPasswordController implements IController {
  public async post(req: IRequest, res: IResponse, next: restify.Next) {
    try {
      const { email } = req.body;

      const user = <IUser> await User.findOne({ where: <IUser>{ email } });

      if (!user) {
        return res.send(new NotFoundError(`User doesn't exist in our db`));
      }

      const { link, token } = generatePasswordResetLink();

      await User.update(<IUser> {
        reset_password_token: hashSync(token, 12),
        reset_password_attempts: 0
      }, { where: { id: user.id } });

      await sendEmail(user.email, user.name, EmailTypes.RESET_PASSWORD, { link, token });

      return res.send({
        success: true,
        message: oneLine`
          Password reset email is successfully sent. Please check your email and follow
          the instructions to reset your password.
        `
      });
    } catch (e) {
      req.log.error(e);
      return res.send(new InternalServerError(e));
    }
    return next();
  }

  public async put(req: IRequest, res: IResponse, next: restify.Next) {
    try {
      const { email, new_password, reset_token } = req.body;
      const user = <IUser> await User.findOne({ where: <IUser>{ email } });

      if (!user) {
        return res.send(new NotFoundError(`User doesn't exist in our db`));
      }

      if (!user.reset_password_token) {
        return res.send({
          error: true,
          message: oneLine`
            This password reset token was either used or has expired. Please try
            generating new password reset token and try again.
          `
        });
      }

      if (user.isMaxPasswordResetAttemptReached()) {
        return res.send({
          error: true,
          message: oneLine`
            Your account has reached max invalid password reset attempts. Please try
            requesting new password reset link again.
          `
        });
      }

      if (!compareSync(reset_token, user.reset_password_token)) {
        // Update the invalid password reset attempts
        // if max attempts reached, change the account status to suspened
        // when the password is successfully reset it'll be set to active
        const invalidAttempts = user.reset_password_attempts + 1;
        const updateObj = <IUser> {
          reset_password_attempts: invalidAttempts
        };

        if (user.isMaxPasswordResetAttemptReached(invalidAttempts)) {
          updateObj.status = UserStatuses.SUSPENDED;
        }

        await User.update(updateObj, { where: { id: user.id } });

        return res.send({
          error: true,
          message: 'Given Password reset token is incorrect'
        });
      }

      await User.update(<IUser> {
        password: hashSync(new_password, 12),
        reset_password_attempts: 0,
        reset_password_token: '',
        status: UserStatuses.ACTIVE
      }, { where: { id: user.id } });

      return res.send({
        success: true,
        message: `Your Password has been reset successfully`
      });
    } catch (e) {
      req.log.error(e);
      return res.send(new InternalServerError(e));
    }
    return next();
  }
}
