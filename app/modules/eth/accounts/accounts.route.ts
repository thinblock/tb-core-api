import * as restify from 'restify';
import AccountsController from './accounts.controller';
import * as Joi from 'joi';
import { IRoute, IRouteConfig, HttpMethods, AuthStrategies } from '../../../interfaces/utils/Route';

class AppsRoute implements IRoute {
  public basePath = '/api/eth/accounts';
  public controller = new AccountsController();

  public getServerRoutes(): IRouteConfig[] {
    return [
      {
        method: HttpMethods.GET,
        auth: AuthStrategies.OAUTH,
        handler: this.controller.getAll,
        validation: {
          schema: {
            query: {
              include_balance: Joi.bool().default(false)
            }
          }
        },
      },
      {
        method: HttpMethods.POST,
        auth: AuthStrategies.OAUTH,
        handler: this.controller.post,
        validation: {
          schema: {
            query: {
              key_action: Joi.string().valid(['return_private_key']).required()
            }
          }
        },
      }
    ];
  }
}

export default AppsRoute;
