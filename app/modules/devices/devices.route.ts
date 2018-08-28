import * as restify from 'restify';
import DeviceController from './devices.controller';
import * as Joi from 'joi';
import { IRoute, IRouteConfig, HttpMethods, AuthStrategies } from '../../interfaces/utils/Route';
import { oneLine } from 'common-tags';

class DevicesRoute implements IRoute {
  public basePath = '/api/devices';
  public controller = new DeviceController();
  public swaggerTag = 'Devices';

  public getServerRoutes(): IRouteConfig[] {
    return [
      {
        method: HttpMethods.GET,
        auth: AuthStrategies.OAUTH,
        handler: this.controller.getAll,
        validation: {
          schema: {
            query: {
              user_id: Joi.string().required(),
            },
          }
        },
        swagger: {
          summary: 'Gets All Devices',
          description: oneLine`
            Gets all devices associated with client and user_id
          `,
          responses: [
            {
              code: 200,
              data: {
                result: [
                  {
                    id: 1,
                    client_id: '8718e710-03d9-42b8-2588-d020x1995dd0',
                    UUID: '123-456-789',
                    user_id: '123421421',
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
        param: 'device_id',
        handler: this.controller.get,
        validation: {
          schema: {
            query: {
              user_id: Joi.string().required(),
            },
          }
        },
        swagger: {
          summary: 'Gets Device',
          description: oneLine`
            Gets single device for given device id.
          `,
          responses: [
            {
              code: 200,
              data: {
                id: 1,
                client_id: '8718e710-03d9-42b8-2588-d020x1995dd0',
                UUID: '123-456-789',
                user_id: '123421421',
                created_at: '2018-08-03T06:09:19.594Z',
                updated_at: '2018-08-03T06:09:19.594Z'
              }
            },
            {
              code: 404,
              data: {
                code: 'NotFoundError',
                message: 'Device not found for given id',
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
              UUID: Joi.string().required(),
              user_id: Joi.string().required()
            }).required()
          }
        },
        swagger: {
          summary: 'Creates Device',
          description: oneLine`
            Creates Device
          `,
          responses: [
            {
              code: 200,
              data: {
                id: 1,
                client_id: '8718e710-03d9-42b8-2588-d020x1995dd0',
                UUID: '123-456-789',
                user_id: '123421421',
                created_at: '2018-08-03T06:09:19.594Z',
                updated_at: '2018-08-03T06:09:19.594Z'
              }
            }
          ]
        },
      },
      {
        method: HttpMethods.DELETE,
        auth: AuthStrategies.OAUTH,
        param: 'device_id',
        handler: this.controller.delete,
        validation: {
          schema: {
            query: {
              user_id: Joi.string().required(),
            },
          }
        },
        swagger: {
          summary: 'Deletes Device',
          description: oneLine`
            Deletes single device for given device id.
          `,
          responses: [
            {
              code: 200,
              data: {
                success: true,
                message: 'Device deleted successfully'
              }
            },
            {
              code: 404,
              data: {
                code: 'NotFoundError',
                message: 'Device not found for given id',
              }
            }
          ]
        },
      },
    ];
  }
}

export default DevicesRoute;
