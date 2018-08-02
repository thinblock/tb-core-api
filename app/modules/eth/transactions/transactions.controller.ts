import * as restify from 'restify';
import { InternalServerError, BadRequestError, NotFoundError } from 'restify-errors';
import IController from '../../../interfaces/utils/IController';
import to from 'await-to-js';
import web3 from '../../../../config/web3';
import Account from '../../../models/account.model';
import { IAccount } from '../../../interfaces/models';
import { IRequest, IResponse } from '../../../interfaces/utils/IServer';
import { ActivityLogEvents } from '../../../interfaces/enums';

export default class AppsController implements IController {

  public async get(req: IRequest, res: IResponse, next: restify.Next) {
    const accountId = req.params.account;
    const clientId = req.client_id;
    const txHash = req.params.transaction_hash;

    if (!web3.utils.isHex(accountId)) {
      return res.send(new BadRequestError('Param "transaction_hash" must be a valid Hex string'));
    }

    if (!web3.utils.isHex(txHash)) {
      return res.send(new BadRequestError('Param "transaction_hash" must be a valid Hex string'));
    }

    try {
      const account: IAccount | any = await Account.findOne({
        where: <IAccount>{ client_id: clientId, address: accountId }
      });

      if (!account) {
        return res.send(new NotFoundError('Given address was not found for these credentials'));
      }

      const tx = await web3.eth.getTransaction(txHash);

      if (!tx) {
        return res.send(new NotFoundError('Given transaction was not found!'));
      }

      const txResponse = {
        tx_hash: tx.hash,
        tx_index: tx.transactionIndex,
        block: {
          hash: tx.blockHash,
          number: tx.blockNumber
        },
        sender: tx.from,
        receiver: tx.to,
        amount: {
          value: web3.utils.fromWei(tx.value, 'ether'),
          unit: 'ether',
        },
        gas: {
          price: tx.gasPrice,
          tx_specified: tx.gas,
          total_block_usage: <any>null,
          tx_usage: <any>null
        },
        status: tx.blockNumber ? 'verified' : 'pending'
      };

      // Check if the tx is verified, if verified extend the response with receipt
      if (tx.blockNumber) {
        const txReceipt = await web3.eth.getTransactionReceipt(txHash);
        txResponse.gas.total_block_usage = txReceipt.cumulativeGasUsed;
        txResponse.gas.tx_usage = txReceipt.gasUsed;
        // False status means its reverted
        // https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransactionreceipt
        txResponse.status = txReceipt.status ? 'verified' : 'reverted';
      }

      return res.send(txResponse);
    } catch (e) {
      req.log.error(e);
      return res.send(new InternalServerError(e));
    }
    return next();
  }

  public async post(req: IRequest, res: IResponse, next: restify.Next) {
    const fromAddress = req.params.account;
    const { private_key, to: receiver, value, gas } = req.body;

    if (!web3.utils.isAddress(fromAddress)) {
      return res.send(new BadRequestError('Param "account" must be a valid Eth address'));
    }

    if (!web3.utils.isAddress(receiver)) {
      return res.send(new BadRequestError('Key "to" must be a valid Eth address'));
    }

    if (!web3.utils.isHex(private_key)) {
      return res.send(new BadRequestError('Key "private_key" must be a valid Hex Private Key'));
    }

    try {
      // Converts ether to smallest denomination wei
      const priceInWei = web3.utils.toWei(value, 'ether').toString();
      const tx = <any> await web3.eth.accounts.signTransaction({
        to: receiver, value: priceInWei, gasPrice: gas, gas: 4712394
      }, private_key);

      const [err, txRes] = await to(web3
        .eth
        .sendSignedTransaction(<string> tx.rawTransaction)
        .once('transactionHash', (hash: string) => {

          req.activityLog(
            req.client_id,
            `Transaction of ${value}ether created successfully`,
            ActivityLogEvents.ETH_TRANSACTION_CREATED, null,
            { hash }
          );

          return res.send({
            success: true,
            message: 'Transaction was successfull!',
            tx_hash: hash,
          });
        })
      );

      if (err) {
        return res.send(new BadRequestError(err.message));
      }
    } catch (e) {
      req.log.error(e);
      return res.send(new InternalServerError(e));
    }
    return next();
  }
}
