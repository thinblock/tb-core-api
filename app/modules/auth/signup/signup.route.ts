import * as restify from 'restify';
import SignupController from './signup.controller';
import * as Joi from 'joi';
import { IRoute, IRouteConfig, HttpMethods, AuthStrategies } from '../../../interfaces/utils/Route';

class LoginRoute implements IRoute {
  public basePath = '/api/auth/signup';
  public controller = new SignupController();

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
              password: Joi.string().required().min(6),
            }).required(),
          }
        }
      }
    ];
  }
}

export default LoginRoute;
