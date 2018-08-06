import * as restify from 'restify';
import { InternalServerError, NotFoundError, ForbiddenError } from 'restify-errors';
import IController from '../../../interfaces/utils/IController';
import { IRequest, IResponse } from '../../../interfaces/utils/IServer';
import WalletAddress from '../../../models/wallet_address.model';
import Wallet from '../../../models/wallet.model';
import { IWalletAddress } from '../../../interfaces/models';
import { IWallet } from '../../../interfaces/models';

export default class WalletAddressesController implements IController {
  public async post(req: IRequest, res: IResponse, next: restify.Next) {
    try {
      const wallet = <IWallet> await Wallet.findOne({
        where: { id: req.params.wallet, client_id: req.client_id }
      });

      if (wallet) {
        const walletAddress = <IWalletAddress> await WalletAddress.create({
          chain: req.body.chain,
          address: req.body.address,
          name: req.body.name,
          wallet_id: req.params.wallet
        });

        return res.send(walletAddress);
      } else {
        return res.send(new ForbiddenError('Action not allowed'));
      }
    } catch (e) {
      req.log.error(e);
      throw new InternalServerError(e);
    }
    return next();
  }

  public async get(req: IRequest, res: IResponse, next: restify.Next) {
    try {
      const wallet = <IWallet> await Wallet.findOne({
        where: { id: req.params.wallet, client_id: req.client_id }
      });

      if (wallet) {
        const walletAddresses = <IWalletAddress[]> await WalletAddress.findAll({
          where: { wallet_id: req.params.wallet }
        });
        if (!walletAddresses) {
          return res.send(new NotFoundError('Wallets not found for given wallet id'));
        }
        return res.send({ result: walletAddresses, total_results: walletAddresses.length });
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
        const walletAddresses = await WalletAddress.destroy({
          where: { wallet_id: req.params.wallet, id: req.params.address }
        });
        return res.send({ success: true, message: 'Wallet Address deleted successfully' });
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
