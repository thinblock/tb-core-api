import * as restify from 'restify';
import TransactionsController from './transactions.controller';
import * as Joi from 'joi';
import { IRoute, IRouteConfig, HttpMethods, AuthStrategies } from '../../../interfaces/utils/Route';

class AppsRoute implements IRoute {
  public basePath = '/api/eth/accounts/:account/transactions';
  public controller = new TransactionsController();

  public getServerRoutes(): IRouteConfig[] {
    return [
      {
        method: HttpMethods.GET,
        auth: AuthStrategies.OAUTH,
        handler: this.controller.get,
        param: 'transaction_hash',
        validation: {
          schema: {
            params: {
              account: Joi.string().length(42).required(),
              transaction_hash: Joi.string().length(66).required()
            }
          }
        }
      },
      {
        method: HttpMethods.POST,
        auth: AuthStrategies.OAUTH,
        handler: this.controller.post,
        validation: {
          schema: {
            body: Joi.object().keys({
              to: Joi.string().length(42).required(),
              value: Joi.string().required(),
              gas: Joi.string().required(),
              private_key: Joi.string().length(66)
            }).required(),
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
