import * as Restify from 'restify';

interface Controller {
  getAll?(req: Restify.Request, res: Restify.Response, next: Restify.Next): boolean;
  get?(req: Restify.Request, res: Restify.Response, next: Restify.Next): any;
  post?(req: Restify.Request, res: Restify.Response, next: Restify.Next): any;
  put?(req: Restify.Request, res: Restify.Response, next: Restify.Next): any;
  delete?(req: Restify.Request, res: Restify.Response, next: Restify.Next): any;
}

export default Controller;