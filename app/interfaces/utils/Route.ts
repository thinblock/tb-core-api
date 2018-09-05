import Controller from './IController';
import { JoiObject } from 'joi';
import * as Restify from 'restify';
import IMiddleware from './IMiddleware';

interface IRoute {
  basePath: string;
  controller: Controller;
  swaggerDescription?: string;
  swaggerTag?: string;
  getServerRoutes(): IRouteConfig[];
}

interface IRouteConfig {
  name?: string;
  param?: string;
  middlewares?: IMiddleware[];
  method: string;
  auth: AuthStrategies;
  handler(req: Restify.Request, res: Restify.Response, next: Restify.Next): Promise<Restify.Next>;
  validation?: {
    schema: JoiObject | Routeschema
  };
  swagger: {
    summary: string;
    description: string;
    responses: ResponseSchema[];
  };
}

interface ResponseSchema {
  code: number;
  data: any;
}

interface Routeschema {
  params?: any;
  body?: any;
  query?: any;
}

enum HttpMethods {
  GET = 'get',
  PUT = 'put',
  POST = 'post',
  DELETE = 'delete'
}

enum AuthStrategies {
  JWT = 'jwt',
  OAUTH = 'oauth',
  PUBLIC = 'public'
}

export {
  HttpMethods,
  AuthStrategies,
  IRouteConfig,
  IRoute,
  Routeschema
};
