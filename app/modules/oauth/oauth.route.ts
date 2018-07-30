import * as restify from 'restify';
import OAuthController from './oauth.controller';
import * as Joi from 'joi';
import { IRoute, IRouteConfig, HttpMethods, AuthStrategies } from '../../interfaces/utils/Route';
import { oneLine } from 'common-tags';

class AppsRoute implements IRoute {
  public basePath = '/api/oauth2/token';
  public controller = new OAuthController();
  public swaggerTag = 'OAuth2';

  public getServerRoutes(): IRouteConfig[] {
    return [
      {
        method: HttpMethods.POST,
        auth: AuthStrategies.PUBLIC,
        handler: this.controller.post,
        validation: {
          schema: {
            body: Joi.object().keys({
              grant_type: Joi.string().valid(['client_credentials']).required(),
            }).required(),
            query: {
              client_id: Joi.string().required(),
              client_secret: Joi.string().required().min(32).max(32),
            },
          }
        },
        swagger: {
          summary: 'Create OAuth Token',
          description: oneLine`
            Creates an OAuth2 token for given credentials.
          `,
          responses: []
        },
      }
    ];
  }
}

export default AppsRoute;
