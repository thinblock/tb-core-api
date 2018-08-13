import * as restify from 'restify';
import { verify } from 'jsonwebtoken';
import to from 'await-to-js';
import { UnauthorizedError, InternalServerError } from 'restify-errors';
import Token from '../models/token.model';
import { IJWTToken, IOAuthToken } from '../interfaces/utils/JWT';
import { config } from '../../config/env';
import { IRequest, IResponse } from '../interfaces/utils/IServer';
import User from '../models/user.model';
import { IUser } from '../interfaces/models';
import { UserStatuses } from '../interfaces/enums';

const jwtAuth = async (req: IRequest, res: IResponse, next: restify.Next) => {
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

    const [err, user] = <[Error, IUser]> await to(User.findOne({ where: { id: decodedToken.id } }));

    if (err) {
      req.log.error(err);
      return res.send(new InternalServerError(err));
    }

    if (!user) {
      return res.send(new UnauthorizedError({
        message: `User doesn't exist in our DB`
      }));
    }

    if (user.status === UserStatuses.SUSPENDED) {
      return res.send(new UnauthorizedError({
        message: `
          This account is suspended for security reasons. Please reset your account password
          to regain access to your account
        `
      }));
    }
  } catch (e) {
    req.log.error(e);
    return res.send(new UnauthorizedError({
      message: 'Provided Access Token was invalid or expired'
    }));
  }

  req.decoded = { user_id: decodedToken.id };
  return next();
};

const oAuth = async (req: IRequest, res: IResponse, next: restify.Next) => {
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
    req.log.error(e);
    return res.send(new UnauthorizedError({
      message: 'Provided Access Token was invalid or expired'
    }));
  }
  req.client_id = decodedToken.client_id;
  return next();
};

export { jwtAuth, oAuth };
