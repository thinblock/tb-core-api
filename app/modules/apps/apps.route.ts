import * as restify from 'restify';
import AppsController from './apps.controller';
import * as Joi from 'joi';
import { IRoute, IRouteConfig, HttpMethods, AuthStrategies } from '../../interfaces/utils/Route';
import { oneLine } from 'common-tags';

class AppsRoute implements IRoute {
  public basePath = '/api/apps';
  public controller = new AppsController();
  public swaggerTag = 'Apps';

  public getServerRoutes(): IRouteConfig[] {
    return [
      {
        method: HttpMethods.GET,
        auth: AuthStrategies.JWT,
        handler: this.controller.getAll,
        swagger: {
          summary: 'Get All Apps',
          description: oneLine`
            Gets all created apps
          `,
          responses: []
        },
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
        },
        swagger: {
          summary: 'Create An App',
          description: oneLine`
            Creates an app.
          `,
          responses: []
        },
      }
    ];
  }
}

export default AppsRoute;
