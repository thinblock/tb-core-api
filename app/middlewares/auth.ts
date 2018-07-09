import * as restify from 'restify';

const jwtAuth = (req: restify.Request, res: restify.Response, next: restify.Next) => {
  // not yet defined
  console.log('working auth');
  return next();
};

export { jwtAuth };
