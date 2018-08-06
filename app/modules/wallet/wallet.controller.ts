import * as restify from 'restify';
import { InternalServerError, NotFoundError } from 'restify-errors';
import IController from '../../interfaces/utils/IController';
import { IRequest, IResponse } from '../../interfaces/utils/IServer';
import Wallet from '../../models/wallet.model';
import WalletAddress from '../../models/wallet_address.model';
import WalletUser from '../../models/wallet_user.model';
import { IWallet } from '../../interfaces/models';

export default class WalletsController implements IController {
  public async post(req: IRequest, res: IResponse, next: restify.Next) {
    try {
      const walletObj = req.body;
      const wallet = <IWallet> await Wallet.create({
        ...walletObj,
        client_id: req.client_id
      });
      return res.send(wallet);
    } catch (e) {
      req.log.error(e);
      throw new InternalServerError(e);
    }
    return next();
  }

  public async get(req: IRequest, res: IResponse, next: restify.Next) {
    try {
      const wallet = await Wallet.findOne({
        where: { id: req.params.wallet_id, client_id: req.client_id },
        include: [
          {
            model: WalletAddress,
            as: 'addresses',
            attributes: ['id']
          },
          {
            model: WalletUser,
            as: 'users',
            attributes: ['id']
          },
        ]
      });

      if (!wallet) {
        return res.send(new restify.NotFoundError('Wallet not found for given id'));
      }

      return res.send(wallet);
    } catch (e) {
      req.log.error(e);
      throw new InternalServerError(e);
    }
    return next();
  }

  public async getAll(req: IRequest, res: IResponse, next: restify.Next) {
    try {
      const wallets = <IWallet[]> await Wallet.findAll({ where: { client_id: req.client_id } });
      return res.send({ result: wallets, total_results: wallets.length });
    } catch (e) {
      req.log.error(e);
      throw new InternalServerError(e);
    }
    return next();
  }
}
