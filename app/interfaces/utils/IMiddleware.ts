import * as Restify from 'restify';

interface IMiddleware {
  init?(req: Restify.Request, res: Restify.Response, next: Restify.Next): Promise<Restify.Next>;
}

export default IMiddleware;