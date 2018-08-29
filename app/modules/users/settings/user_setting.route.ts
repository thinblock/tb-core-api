import UserSettingController from './user_setting.controller';
import * as Joi from 'joi';
import { IRoute, IRouteConfig, HttpMethods, AuthStrategies } from '../../../interfaces/utils/Route';
import { oneLine } from 'common-tags';

class UserSettingsRoute implements IRoute {
  public basePath = '/api/users/me/settings';
  public controller = new UserSettingController();
  public swaggerTag = 'Users';

  public getServerRoutes(): IRouteConfig[] {
    return [
      {
        method: HttpMethods.PUT,
        auth: AuthStrategies.JWT,
        handler: this.controller.put,
        validation: {
          schema: {
            body: Joi.object().keys({
              enable_otp: Joi.boolean().required(),
              phone: Joi.string().required(),
              user_id: Joi.number().required()
            }).required()
          }
        },
        swagger: {
          summary: 'Updates User Settings',
          description: oneLine`
            Updates User Settings
          `,
          responses: [
            {
              code: 200,
              data: {
                success: true,
                message: 'Updated user settings'
              }
            }
          ]
        },
      }
    ];
  }
}

export default UserSettingsRoute;
