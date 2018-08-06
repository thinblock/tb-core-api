import * as restify from 'restify';
import { InternalServerError, NotFoundError, ForbiddenError } from 'restify-errors';
import IController from '../../../interfaces/utils/IController';
import { IRequest, IResponse } from '../../../interfaces/utils/IServer';
import WalletUser from '../../../models/wallet_user.model';
import Wallet from '../../../models/wallet.model';
import { IWallet } from '../../../interfaces/models';
import { IWalletUser } from '../../../interfaces/models';

export default class WalletUsersController implements IController {
  public async post(req: IRequest, res: IResponse, next: restify.Next) {
    try {
      const wallet = <IWallet> await Wallet.findOne({
        where: { id: req.params.wallet, client_id: req.client_id }
      });

      if (wallet) {
        const walletUser = <IWalletUser> await WalletUser.create({
          user_id: req.body.user_id,
          client_id: req.client_id,
          wallet_id: req.params.wallet
        });

        return res.send(walletUser);
      } else {
        return res.send(new ForbiddenError('Action not allowed'));
      }
    } catch (e) {
      req.log.error(e);
      throw new InternalServerError(e);
    }
    return next();
  }

  public async getAll(req: IRequest, res: IResponse, next: restify.Next) {
    try {
      const wallet = <IWallet> await Wallet.findOne({
        where: { id: req.params.wallet, client_id: req.client_id }
      });

      if (wallet) {
        const walletUsers = <IWalletUser[]> await WalletUser.findAll(
          { where: { wallet_id: req.params.wallet } }
        );
        if (!walletUsers) {
          return res.send(new NotFoundError('Users not found for given wallet id'));
        }
        return res.send({ result: walletUsers, total_results: walletUsers.length });
      } else {
        return res.send(new ForbiddenError('Action not allowed'));
      }
    } catch (e) {
      req.log.error(e);
      throw new InternalServerError(e);
    }
    return next();
  }

  public async delete(req: IRequest, res: IResponse, next: restify.Next) {
    try {
      const wallet = <IWallet> await Wallet.findOne({
        where: { id: req.params.wallet, client_id: req.client_id }
      });

      if (wallet) {
        const walletUser = await WalletUser.destroy({
          where: { wallet_id: req.params.wallet, id: req.params.user }
        });
        return res.send({ success: true, message: 'Wallet User deleted successfully' });
      } else {
        return res.send(new ForbiddenError('Action not allowed'));
      }
    } catch (e) {
      req.log.error(e);
      throw new InternalServerError(e);
    }
    return next();
  }
}
