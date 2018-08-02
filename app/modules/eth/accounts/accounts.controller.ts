import * as restify from 'restify';
import { InternalServerError } from 'restify-errors';
import IController from '../../../interfaces/utils/IController';
import Account from '../../../models/account.model';
import web3 from '../../../../config/web3';
import { IAccount } from '../../../interfaces/models';
import { ActivityLogEvents } from '../../../interfaces/enums';
import { IRequest, IResponse } from '../../../interfaces/utils/IServer';
import { logger } from '../../../../utils/logger';

export default class AppsController implements IController {
  public async post(req: IRequest, res: IResponse, next: restify.Next) {
    const clientId = req.client_id;
    try {
      let ethAccount = web3.eth.accounts.create();
      const account = await Account.create(<IAccount> {
        client_id: clientId,
        address: ethAccount.address,
        key: ethAccount.privateKey
      });

      req.activityLog(
        clientId,
        'Account creatd successfully',
        ActivityLogEvents.ETH_ACCOUNT_CREATED,
        null, { address: ethAccount.address }
      );

      ethAccount = null;
      return res.send(account);
    } catch (e) {
      req.log.error(e);
      res.send(new InternalServerError(e));
    }
    return next();
  }

  public async getAll(req: IRequest, res: IResponse, next: restify.Next) {
    const clientId: string = req.client_id;
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
            req.log.error(e);
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
      req.log.error(e);
      return res.send(new InternalServerError(e));
    }
    return next();
  }
}
