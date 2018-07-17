import * as restify from 'restify';
import { compareSync } from 'bcrypt';
import { v4 } from 'node-uuid';
import { sign } from 'jsonwebtoken';
import { InternalServerError, ForbiddenError } from 'restify-errors';
import IController from '../../interfaces/utils/IController';
import App from '../../models/app.model';
import Token from '../../models/token.model';
import { IApp, IToken } from '../../interfaces/models';
import { config } from '../../../config/env';

export default class OAuthController implements IController {
  public async post(req: any, res: restify.Response, next: restify.Next) {
    const { client_id, client_secret } = req.query;
    try {
      const app = <IApp> await App.findOne({ where: { client_id } });

      if (!app) {
        return res.send(new ForbiddenError(403, 'Unable to verify your credentials'));
      }

      const clientSecretHash = app.client_secret;

      if (!compareSync(client_secret, clientSecretHash)) {
        return res.send(new ForbiddenError(403, 'Unable to verify your credentials'));
      }
      const tokenId = v4();
      const jwt = sign({ client_id, token_id: tokenId }, config.oAuthSecret);

      await Token.create(<IToken> { client_id, token_id: tokenId });
      return res.send({ access_token: jwt, token_type: 'bearer' });
    } catch (e) {
      console.log(e);
      throw new InternalServerError(e);
    }
  }
}
