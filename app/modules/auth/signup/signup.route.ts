import * as restify from 'restify';
import SignupController from './signup.controller';
import * as Joi from 'joi';
import { IRoute, IRouteConfig, HttpMethods, AuthStrategies } from '../../../interfaces/utils/Route';
import { oneLine } from 'common-tags';

class SignupRoute implements IRoute {
  public basePath = '/api/auth/signup';
  public controller = new SignupController();
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
              name: Joi.string().required(),
              email: Joi.string().email().required(),
              password: Joi.string().required().min(6)
            }).required(),
          }
        },
        swagger: {
          summary: 'Create User',
          description: oneLine`
            Signs up user with name, email and password.
          `,
          responses: []
        },
      }
    ];
  }
}

export default SignupRoute;
