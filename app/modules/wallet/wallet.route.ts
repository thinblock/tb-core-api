import * as restify from 'restify';
import WalletController from './wallet.controller';
import * as Joi from 'joi';
import { IRoute, IRouteConfig, HttpMethods, AuthStrategies } from '../../interfaces/utils/Route';
import { oneLine } from 'common-tags';

class WalletsRoute implements IRoute {
  public basePath = '/api/wallets';
  public controller = new WalletController();
  public swaggerTag = 'Wallets';

  public getServerRoutes(): IRouteConfig[] {
    return [
      {
        method: HttpMethods.GET,
        auth: AuthStrategies.OAUTH,
        handler: this.controller.getAll,
        swagger: {
          summary: 'Gets All Wallets',
          description: oneLine`
            Gets all wallets
          `,
          responses: [
            {
              code: 200,
              data: {
                result: [
                  {
                    id: 1,
                    client_id: '8718e710-03d9-42b8-2588-d020x1995dd0',
                    user_id: '2',
                    name: 'My wallet',
                    created_at: '2018-08-03T06:09:19.594Z',
                    updated_at: '2018-08-03T06:09:19.594Z'
                  }
                ],
                total_results: 1
              }
            }
          ]
        },
      },
      {
        method: HttpMethods.GET,
        auth: AuthStrategies.OAUTH,
        param: 'wallet_id',
        handler: this.controller.get,
        swagger: {
          summary: 'Gets Wallet Addresses',
          description: oneLine`
            Gets single wallet for given wallet id.
          `,
          responses: [
            {
              code: 200,
              data: {
                id: 1,
                client_id: '8718e710-03d9-42b8-2588-d020x1995dd0',
                user_id: '2',
                name: 'My wallet',
                created_at: '2018-08-03T06:09:19.594Z',
                updated_at: '2018-08-03T06:09:19.594Z',
                addresses: [
                  {
                    id: 2
                  }
                ],
                users: [
                  {
                    id: 1
                  }
                ]
              }
            },
            {
              code: 404,
              data: {
                code: 'NotFoundError',
                message: 'Wallet not found for given id',
              }
            }
          ]
        },
      },
      {
        method: HttpMethods.POST,
        auth: AuthStrategies.OAUTH,
        handler: this.controller.post,
        validation: {
          schema: {
            body: Joi.object().keys({
              name: Joi.string().required(),
              user_id: Joi.string().required()
            }).required()
          }
        },
        swagger: {
          summary: 'Creates Wallet',
          description: oneLine`
            Creates Wallet
          `,
          responses: [
            {
              code: 200,
              data: {
                id: 3,
                name: 'Nice wallet',
                user_id: '2',
                client_id: '87f8e710-03c9-42b8-9588-d02021995dd0',
                updated_at: '2018-08-03T09:26:26.644Z',
                created_at: '2018-08-03T09:26:26.644Z'
              }
            }
          ]
        },
      }
    ];
  }
}

export default WalletsRoute;
