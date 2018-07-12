import * as Restify from 'restify';

interface IController {
  getAll?(req: Restify.Request, res: Restify.Response, next: Restify.Next): boolean;
  get?(req: Restify.Request, res: Restify.Response, next: Restify.Next): any;
  post?(req: Restify.Request, res: Restify.Response, next: Restify.Next): any;
  put?(req: Restify.Request, res: Restify.Response, next: Restify.Next): any;
  delete?(req: Restify.Request, res: Restify.Response, next: Restify.Next): any;
}

export default IController;