import * as restify from 'restify';
import LoginController from '../controllers/login.controller';
import * as Joi from 'joi';
import { IRoute, IRouteConfig, HttpMethods, AuthStrategies } from '../interfaces/utils/Route';

class LoginRoute implements IRoute {
  public basePath = '/api/auth/login';
  public controller = new LoginController();

  public getServerRoutes(): IRouteConfig[] {
    return [
      {
        method: HttpMethods.GET,
        auth: AuthStrategies.PUBLIC,
        handler: this.controller.post,
        validation: {
          schema: {
            body: Joi.object({
              email: Joi.string().email().required(),
              password: Joi.string().min(6).required()
            })
          }
        }
      }
    ];
  }
}

export default LoginRoute;
