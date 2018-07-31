import * as restify from 'restify';
import LoginController from './keys.controller';
import * as Joi from 'joi';
import { IRoute, IRouteConfig, HttpMethods, AuthStrategies } from '../../interfaces/utils/Route';
import { oneLine } from 'common-tags';

class KeysRoute implements IRoute {
  public basePath = '/api/keys';
  public controller = new LoginController();
  public swaggerTag = 'Keys';

  public getServerRoutes(): IRouteConfig[] {
    return [
      {
        method: HttpMethods.GET,
        auth: AuthStrategies.OAUTH,
        param: 'key_id',
        handler: this.controller.get,
        validation: {
          schema: {
            params: Joi.object().keys({
              key_id: Joi.number().required(),
            }).required()
          }
        },
        swagger: {
          summary: 'Gets Encrypted Key',
          description: oneLine`
            Gets the encrypted key for the given key id.
          `,
          responses: [
            {
              code: 200,
              data: {
                id: 203,
                encrypted_key: '96A467D2Da922D7d08cB77253686c9c1cFAF723908cB77253686c9c1cFAF7239',
                user_id: '29',
                created_at: '2018-07-30T11:34:45.141Z'
              }
            },
            {
              code: 404,
              data: {
                code: 'NotFoundError',
                message: 'Key not found for given credentials',
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
              encrypted_key: Joi.string().required(),
              user_id: Joi.string().required()
            }).required()
          }
        },
        swagger: {
          summary: 'Creates Encrypted Key',
          description: oneLine`
            Adds the Encrypted key in ThinBlock under the given user id.
          `,
          responses: [
            {
              code: 200,
              data: {
                success: true,
                message: 'Key saved successfully!',
                key_id: 1
              }
            }
          ]
        },
      }
    ];
  }
}

export default KeysRoute;
