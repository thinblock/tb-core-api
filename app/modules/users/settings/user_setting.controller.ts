import * as restify from 'restify';
import { InternalServerError, NotFoundError } from 'restify-errors';
import IController from '../../../interfaces/utils/IController';
import { IRequest, IResponse } from '../../../interfaces/utils/IServer';
import UserSettings from '../../../models/user_setting.model';
import to from 'await-to-js';
import { IUserSettings } from '../../../interfaces/models';

export default class UserSettingsController implements IController {
  public async put(req: IRequest, res: IResponse, next: restify.Next) {
    try {
      const [err, userSetting] = <[Error, IUserSettings]> await to (UserSettings.update(
        {
          enable_otp: req.body.enable_otp,
          phone: req.body.phone
        },
        { where: { user_id: req.body.user_id } }
      ));

      if (err) {
        req.log.error(err);
        return res.send(new InternalServerError(err));
      }

      if (!userSetting) {
        return res.send(new restify.NotFoundError('User not found for given id'));
      }

      return res.send({ success: true, message: 'Updated user settings' });
    } catch (e) {
      req.log.error(e);
      throw new InternalServerError(e);
    }
    return next();
  }
}
