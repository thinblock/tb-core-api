import * as restify from 'restify';
import UserController from './users.controller';
import * as Joi from 'joi';
import { IRoute, IRouteConfig, HttpMethods, AuthStrategies } from '../../../interfaces/utils/Route';
import { oneLine } from 'common-tags';

class WalletUsersRoute implements IRoute {
  public basePath = '/api/wallets/:wallet/authorized_users';
  public controller = new UserController();
  public swaggerTag = 'Wallets';

  public getServerRoutes(): IRouteConfig[] {
    return [
      {
        method: HttpMethods.GET,
        auth: AuthStrategies.OAUTH,
        handler: this.controller.getAll,
        validation: {
          schema: {
            params: Joi.object().keys({
              wallet: Joi.number().required(),
            }).required()
          }
        },
        swagger: {
          summary: 'Get Wallet Users',
          description: 'Gets users of given wallet',
          responses: [
            {
              code: 200,
              data: {
                result: [
                  {
                    id: 1,
                    wallet_id: 1,
                    client_id: '1',
                    user_id: '3',
                    created_at: '2018-08-02T06:19:56.687Z',
                    updated_at: '2018-08-02T06:19:56.687Z'
                  }
                ],
                total_results: 1
              }
            }
          ]
        }
      },
      {
        method: HttpMethods.POST,
        auth: AuthStrategies.OAUTH,
        handler: this.controller.post,
        validation: {
          schema: {
            params: Joi.object().keys({
              wallet: Joi.number().required(),
            }).required(),
            body: Joi.object().keys({
              user_id: Joi.string().required()
            }).required()
          }
        },
        swagger: {
          summary: 'Add Wallet User',
          description: 'Adds user to given wallet',
          responses: [
            {
              code: 200,
              data: {
                id: 1,
                user_id: '4',
                client_id: '87f8e710-03c9-42b8-9588-d02021995dd0',
                wallet_id: 1,
                updated_at: '2018-08-03T09:56:49.721Z',
                created_at: '2018-08-03T09:56:49.721Z'
              }
            }
          ]
        }
      },
      {
        method: HttpMethods.DELETE,
        auth: AuthStrategies.OAUTH,
        handler: this.controller.delete,
        param: 'user',
        validation: {
          schema: {
            params: Joi.object().keys({
              wallet: Joi.number().required(),
              user: Joi.string().required()
            }).required()
          }
        },
        swagger: {
          summary: 'Delete Wallet User',
          description: 'Deletes user from given wallet',
          responses: [
            {
              code: 200,
              data: {
                success: true,
                message: 'Wallet User deleted successfully'
              }
            }
          ]
        }
      }
    ];
  }
}

export default WalletUsersRoute;
