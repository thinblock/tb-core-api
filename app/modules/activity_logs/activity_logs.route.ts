import * as restify from 'restify';
import ActivityLogsController from './activity_logs.controller';
import * as Joi from 'joi';
import { IRoute, IRouteConfig, HttpMethods, AuthStrategies } from '../../interfaces/utils/Route';
import { oneLine } from 'common-tags';

class ActivityLogsRoute implements IRoute {
  public basePath = '/api/activity_logs';
  public controller = new ActivityLogsController();
  public swaggerTag = 'Activity Logs';

  public getServerRoutes(): IRouteConfig[] {
    return [
      {
        method: HttpMethods.GET,
        auth: AuthStrategies.OAUTH,
        handler: this.controller.get,
        validation: {
          schema: {
            query: {
              user_id: Joi.string()
            },
          }
        },
        swagger: {
          summary: `Get Account's Activity Log`,
          description: oneLine`
            Gets the Activty Logs of the Credentials which are being used to access
             the ThinBlock's API. If you want to filter for your specific user. You can
             provide 'user_id' in query params to filter the log only to that user's
             activity.
          `,
          responses: [
            {
              code: 200,
              data: {
                result: [
                  {
                    id: 1,
                    log: 'Account created successfully',
                    event_type: 'eth_account_created'
                  },
                  {
                    id: 2,
                    log: 'Key added successfully',
                    user_id: '209',
                    event_type: 'user_key_added'
                  }
                ]
              }
            }
          ]
        },
      }
    ];
  }
}

export default ActivityLogsRoute;
