import * as restify from 'restify';
import AppsController from './apps.controller';
import * as Joi from 'joi';
import { IRoute, IRouteConfig, HttpMethods, AuthStrategies } from '../../interfaces/utils/Route';

class AppsRoute implements IRoute {
  public basePath = '/api/apps';
  public controller = new AppsController();

  public getServerRoutes(): IRouteConfig[] {
    return [
      {
        method: HttpMethods.GET,
        auth: AuthStrategies.JWT,
        handler: this.controller.getAll,
      },
      {
        method: HttpMethods.POST,
        auth: AuthStrategies.JWT,
        handler: this.controller.post,
        validation: {
          schema: {
            body: Joi.object().keys({
              name: Joi.string().min(2).required(),
            }).required()
          }
        }
      }
    ];
  }
}

export default AppsRoute;
