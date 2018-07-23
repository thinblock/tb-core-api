import * as restify from 'restify';
import BalanceController from './balance.controller';
import * as Joi from 'joi';
import { IRoute, IRouteConfig, HttpMethods, AuthStrategies } from '../../../interfaces/utils/Route';

class AppsRoute implements IRoute {
  public basePath = '/api/eth/accounts/:account/balance';
  public controller = new BalanceController();

  public getServerRoutes(): IRouteConfig[] {
    return [
      {
        method: HttpMethods.GET,
        auth: AuthStrategies.OAUTH,
        handler: this.controller.get,
        validation: {
          schema: {
            params: {
              account: Joi.string().length(42).required(),
            }
          }
        }
      }
    ];
  }
}

export default AppsRoute;
