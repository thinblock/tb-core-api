import * as restify from 'restify';
import AddressController from './addresses.controller';
import * as Joi from 'joi';
import { IRoute, IRouteConfig, HttpMethods, AuthStrategies } from '../../../interfaces/utils/Route';
import { oneLine } from 'common-tags';

class WalletAddressesRoute implements IRoute {
  public basePath = '/api/wallets/:wallet/addresses';
  public controller = new AddressController();
  public swaggerTag = 'Wallets';

  public getServerRoutes(): IRouteConfig[] {
    return [
      {
        method: HttpMethods.GET,
        auth: AuthStrategies.OAUTH,
        handler: this.controller.get,
        validation: {
          schema: {
            params: Joi.object().keys({
              wallet: Joi.number().required(),
            }).required()
          }
        },
        swagger: {
          summary: 'Get Wallet Address',
          description: 'Gets addresses of given wallet',
          responses: [
            {
              code: 200,
              data: {
                result: [
                  {
                    id: 2,
                    wallet_id: 1,
                    chain: 'btc',
                    address: '2x',
                    name: 'btc address',
                    created_at: '2018-08-02T06:26:54.472Z',
                    updated_at: '2018-08-02T06:26:54.472Z'
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
              chain: Joi.string().valid(['eth', 'btc']).required(),
              address: Joi.string().required(),
              name: Joi.string().required()
            }).required()
          }
        },
        swagger: {
          summary: 'Add Wallet Address',
          description: 'Adds address to given wallet',
          responses: [
            {
              code: 200,
              data: {
                id: 5,
                chain: 'btc',
                address: '4x',
                name: 'btc address',
                wallet_id: 1,
                updated_at: '2018-08-03T10:11:57.137Z',
                created_at: '2018-08-03T10:11:57.137Z'
              }
            }
          ]
        }
      },
      {
        method: HttpMethods.DELETE,
        auth: AuthStrategies.OAUTH,
        handler: this.controller.delete,
        param: 'address',
        validation: {
          schema: {
            params: Joi.object().keys({
              wallet: Joi.number().required(),
              address: Joi.string().required()
            }).required()
          }
        },
        swagger: {
          summary: 'Delete Wallet Address',
          description: 'Deletes address from given wallet',
          responses: [
            {
              code: 200,
              data: {
                success: true,
                message: 'Wallet Address deleted successfully'
              }
            }
          ]
        }
      }
    ];
  }
}

export default WalletAddressesRoute;
