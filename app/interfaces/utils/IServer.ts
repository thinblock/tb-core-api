import { Request as IReq } from 'restify';

export default interface IRequest extends IReq {
  client_id: string;
}