import * as restify from 'restify';
import { oneLine } from 'common-tags';
import TransactionsController from './transactions.controller';
import * as Joi from 'joi';
import { IRoute, IRouteConfig, HttpMethods, AuthStrategies } from '../../../interfaces/utils/Route';
import AuthDeviceCheckMiddleware from '../../../middlewares/device';

class AppsRoute implements IRoute {
  public basePath = '/api/eth/accounts/:account/transactions';
  public controller = new TransactionsController();
  public swaggerTag = 'Ethereum';
  public swaggerDescription = oneLine`
    This API is about transactions. You'll need an ethereum account to access this route.
    The account must be created from ThinBlock's API.
  `;

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
        },
        swagger: {
          summary: 'Retreive Transaction With TX Hash',
          description: 'This route gets the transaction info for a certain tx hash',
          responses: [
            {
              code: 200,
              data: {
                tx_hash: '0x38293289sads8f932893',
                status: 'pending'
              }
            }
          ]
        }
      },
      {
        method: HttpMethods.POST,
        auth: AuthStrategies.OAUTH,
        middlewares: [new AuthDeviceCheckMiddleware()],
        handler: this.controller.post,
        validation: {
          schema: {
            body: Joi.object().keys({
              to: Joi.string().length(42).required().meta({}),
              value: Joi.string().required(),
              gas: Joi.string().required(),
              private_key: Joi.string().length(66),
              user_id: Joi.string().required()
            }).required(),
            params: {
              account: Joi.string().length(42).required(),
            }
          }
        },
        swagger: {
          summary: 'Creates Transaction',
          description: 'Create a Transaction in given account with private_key',
          responses: []
        }
      }
    ];
  }
}

export default AppsRoute;
