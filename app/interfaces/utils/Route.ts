import Controller from './Controller';
import * as Restify from 'restify';

interface IRoute {
  basePath: string;
  controller: Controller;
  getServerRoutes(): IRouteConfig[];
}

interface IRouteConfig {
  name?: string;
  method: string;
  auth: AuthStrategies;
  handler(req: Restify.Request, res: Restify.Response, next: Restify.Next): Restify.Next;
  validation?: {
    schema: Routeschema
  };
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
  IRoute
};