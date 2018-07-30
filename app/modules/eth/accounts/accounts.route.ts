import * as restify from 'restify';
import { oneLine } from 'common-tags';
import AccountsController from './accounts.controller';
import * as Joi from 'joi';
import { IRoute, IRouteConfig, HttpMethods, AuthStrategies } from '../../../interfaces/utils/Route';

class AppsRoute implements IRoute {
  public basePath = '/api/eth/accounts';
  public controller = new AccountsController();
  public swaggerTag = 'Ethereum';

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
        swagger: {
          summary: 'Get All Eth Accounts',
          description: oneLine`
            Gets all ethereum accounts created with ThinBlock. You can also retreive the
            confirmed eth balance by making 'include_balance=true'
          `,
          responses: []
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
        swagger: {
          summary: 'Create Eth Account',
          description: oneLine`
            Creates an ethereum account and save its address in ThinBlock
          `,
          responses: []
        },
      }
    ];
  }
}

export default AppsRoute;
