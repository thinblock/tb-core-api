import * as restify from 'restify';
import LoginController from './login.controller';
import * as Joi from 'joi';
import { IRoute, IRouteConfig, HttpMethods, AuthStrategies } from '../../../interfaces/utils/Route';
import { oneLine } from 'common-tags';

class LoginRoute implements IRoute {
  public basePath = '/api/auth/login';
  public controller = new LoginController();
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
              email: Joi.string().email().required(),
              password: Joi.string().min(6).required()
            }).required()
          }
        },
        swagger: {
          summary: 'Login User',
          description: oneLine`
            Returns JWT token in exchange for credentials which can be used to access
            protected routes.
          `,
          responses: []
        },
      }
    ];
  }
}

export default LoginRoute;
