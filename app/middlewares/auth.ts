import * as restify from 'restify';
import { verify } from 'jsonwebtoken';
import { UnauthorizedError } from 'restify-errors';
import IJWTToken from '../interfaces/utils/JWT';
import { config } from '../../config/env';

const jwtAuth = (req: restify.Request, res: restify.Response, next: restify.Next) => {
  // not yet defined
  const token: string = <string>(req.headers.authorization || req.headers.Authorization);
  if (!token) {
    return res.send(new UnauthorizedError({
      message: 'No Access Token was specified in the Request Headers'
    }));
  }
  let decodedToken: IJWTToken = null;

  try {
    decodedToken = <IJWTToken>verify(token, config.jwtSecret);
    if (!decodedToken) {
      return res.send(new UnauthorizedError({
        message: 'Provided Access Token was invalid or expired'
      }));
    }
  } catch (e) {
    return res.send(new UnauthorizedError({
      message: 'Provided Access Token was invalid or expired'
    }));
  }
  req.decoded = { user_id: decodedToken.id };
  return next();
};

export { jwtAuth };
