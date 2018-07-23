import * as restify from 'restify';
import { InternalServerError } from 'restify-errors';
import IController from '../../../interfaces/utils/IController';
import Account from '../../../models/account.model';
import web3 from '../../../../config/web3';
import { IAccount } from '../../../interfaces/models';

export default class AppsController implements IController {
  public async post(req: any, res: restify.Response, next: restify.Next) {
    const clientId = req.client_id;
    try {
      let ethAccount = web3.eth.accounts.create();
      const account = await Account.create(<IAccount> {
        client_id: clientId,
        address: ethAccount.address,
        key: ethAccount.privateKey
      });
      ethAccount = null;
      return res.send(account);
    } catch (e) {
      throw new InternalServerError(e);
    }
    return next();
  }

  public async getAll(req: any, res: restify.Response, next: restify.Next) {
    const clientId: number = req.client_id;
    const includeBalance: boolean = req.query.include_balance;
    try {
      const accounts: IAccount[] = (
        await Account.findAll({ where: { client_id: clientId } })
      ).map((app: IAccount) => {
        const { client_id, address, id, created_at, key } = app;
        return { address, id, client_id, created_at, key };
      });

      if (includeBalance) {
        for (let account of accounts) {
          try {
            Object.assign(account, {
              balance: web3.utils.fromWei((await web3.eth.getBalance(account.address)), 'ether')
            });
          } catch (e) {
            Object.assign(account, { balance: null });
          }
        }
      }

      return res.send({
        result: accounts,
        total: accounts.length,
        total_pages: 1
      });
    } catch (e) {
      throw new InternalServerError(e);
    }
    return next();
  }
}
