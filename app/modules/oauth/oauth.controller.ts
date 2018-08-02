import * as restify from 'restify';
import { compareSync } from 'bcrypt';
import { v4 } from 'node-uuid';
import { sign } from 'jsonwebtoken';
import { InternalServerError, ForbiddenError } from 'restify-errors';
import IController from '../../interfaces/utils/IController';
import App from '../../models/app.model';
import Token from '../../models/token.model';
import { IApp, IToken } from '../../interfaces/models';
import { ActivityLogEvents } from '../../interfaces/enums';
import { IRequest, IResponse } from '../../interfaces/utils/IServer';
import { config } from '../../../config/env';

export default class OAuthController implements IController {
  public async post(req: IRequest, res: IResponse, next: restify.Next) {
    const { client_id, client_secret } = req.query;
    try {
      const app = <IApp> await App.findOne({ where: { client_id } });

      if (!app) {
        return res.send(new ForbiddenError('Unable to verify your credentials'));
      }

      const clientSecretHash = app.client_secret;

      if (!compareSync(client_secret, clientSecretHash)) {
        return res.send(new ForbiddenError('Unable to verify your credentials'));
      }
      const tokenId = v4();
      const jwt = sign({ client_id, token_id: tokenId }, config.oAuthSecret);

      await Token.create(<IToken> { client_id, token_id: tokenId });

      req.activityLog(
        client_id, 'OAuth Token created successfully',
        ActivityLogEvents.OAUTH_TOKEN_CREATED
      );

      return res.send({ access_token: jwt, token_type: 'bearer' });
    } catch (e) {
      req.log.error(e);
      throw new InternalServerError(e);
    }
  }
}
