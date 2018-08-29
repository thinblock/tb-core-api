import TwoFactorAuthorizationController from './two_factor_authorization.controller';
import * as Joi from 'joi';
import { IRoute, IRouteConfig, HttpMethods, AuthStrategies } from '../../../interfaces/utils/Route';
import { oneLine } from 'common-tags';

class TwoFactorAuthorizationRoute implements IRoute {
  public basePath = '/api/auth/2fa';
  public controller = new TwoFactorAuthorizationController();
  public swaggerTag = 'Authentication';

  public getServerRoutes(): IRouteConfig[] {
    return [
      {
        method: HttpMethods.POST,
        auth: AuthStrategies.PUBLIC,
        handler: this.controller.post,
        validation: {
          schema: {
            body: Joi.object().keys({
              phone: Joi.string().required(),
              otp: Joi.string().required()
            }).required()
          }
        },
        swagger: {
          summary: '2FA',
          description: oneLine`
            Returns JWT token in exchange for One Time Password which can be
            used to access protected routes.
          `,
          responses: [
            {
              code: 200,
              data: {
                access_token: '3PYgJEmXtWoZbgsA4OxBR00fb20ymsha7wOX18QY0wU',
                user: {
                  id: 8,
                  auth_provider: 'EMAIL'
                }
              }
            },
            {
              code: 404,
              data: {
                code: 'NotFound',
                message: 'User doesn\'t exist in our db'
              }
            },
            {
              code: 200,
              data: {
                error: true,
                message: 'Wrong OTP entered'
              }
            },
            {
              code: 200,
              data: {
                error: true,
                message: 'Too many attempts - Blocking account'
              }
            },
          ]
        },
      }
    ];
  }
}

export default TwoFactorAuthorizationRoute;