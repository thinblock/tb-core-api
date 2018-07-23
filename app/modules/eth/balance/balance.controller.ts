import * as restify from 'restify';
import { InternalServerError, NotFoundError, BadRequestError } from 'restify-errors';
import IController from '../../../interfaces/utils/IController';
import Account from '../../../models/account.model';
import web3 from '../../../../config/web3';
import { IAccount } from '../../../interfaces/models';

export default class AppsController implements IController {
  public async get(req: any, res: restify.Response, next: restify.Next) {
    const clientId: number = req.client_id;
    const accountAddress: string = req.params.account;

    if (!web3.utils.isAddress(accountAddress)) {
      return res.send(new BadRequestError('Param address must be a correct Eth address'));
    }

    try {
      const account: IAccount|any = await Account.findOne({
        where: { client_id: clientId, address: accountAddress }
      });

      if (!account) {
        return res.send(new NotFoundError('Given address was not found for these credentials'));
      }

      const balance = web3.utils.fromWei((await web3.eth.getBalance(account.address)), 'ether');

      return res.send({ address: accountAddress, balance, unit: 'ether' });
    } catch (e) {
      throw new InternalServerError(e);
    }
    return next();
  }
}
