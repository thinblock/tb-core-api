import { Request as IReq, Response as IRes } from 'restify';
import { ActivityLogEvents } from '../enums';

export interface IRequest extends IReq {
  client_id: string;
  decoded: {
    user_id: number;
  };
  query: any;
  activityLog(
    clientId: string, msg: string, type: ActivityLogEvents, userId?: string, data?: any
  ): any;
}

export interface IResponse extends IRes {}
