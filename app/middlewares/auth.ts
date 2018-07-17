import * as restify from 'restify';
import { verify } from 'jsonwebtoken';
import { UnauthorizedError } from 'restify-errors';
import Token from '../models/token.model';
import { IJWTToken, IOAuthToken } from '../interfaces/utils/JWT';
import { config } from '../../config/env';

const jwtAuth = (req: any, res: restify.Response, next: restify.Next) => {
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
    console.log(e);
    return res.send(new UnauthorizedError({
      message: 'Provided Access Token was invalid or expired'
    }));
  }
  req.decoded = { user_id: decodedToken.id };
  return next();
};

const oAuth = async (req: any, res: restify.Response, next: restify.Next) => {
  // not yet defined
  const tokenHeader: string = <string>(req.headers.authorization || req.headers.Authorization);

  const token = (tokenHeader || '').split(' ')[1]; // Token is of the form 'Bearer asdfsa'
  if (!token) {
    return res.send(new UnauthorizedError({
      message: 'No Access Token was specified in the Request Headers '
                + 'or Access Token is not in form "Bearer <token>"'
    }));
  }
  let decodedToken: IOAuthToken = null;

  try {
    decodedToken = <IOAuthToken>verify(token, config.oAuthSecret);
    if (!decodedToken) {
      return res.send(new UnauthorizedError({
        message: 'Provided Access Token was invalid or expired'
      }));
    }

    const tokenObj = await Token.findOne({
      where: {
        client_id: decodedToken.client_id,
        token_id: decodedToken.token_id
      }
    });

    if (!tokenObj) {
      return res.send(new UnauthorizedError({
        message: 'Provided Access Token was invalid or expired or revoked'
      }));
    }
  } catch (e) {
    console.log(e);
    return res.send(new UnauthorizedError({
      message: 'Provided Access Token was invalid or expired'
    }));
  }
  req.decoded = { client_id: decodedToken.client_id };
  return next();
};

export { jwtAuth, oAuth };
