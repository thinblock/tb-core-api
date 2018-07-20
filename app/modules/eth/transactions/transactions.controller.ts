import * as restify from 'restify';
import { InternalServerError, BadRequestError } from 'restify-errors';
import IController from '../../../interfaces/utils/IController';
import to from 'await-to-js';
import web3 from '../../../../config/web3';
import { IAccount } from '../../../interfaces/models';

export default class AppsController implements IController {
  public async post(req: any, res: restify.Response, next: restify.Next) {
    const { private_key, to: receiver, value, gas } = req.body;

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
          console.log(hash, 'asdfsafd');
          return res.send({
            success: true,
            message: 'Transaction was successfull!',
            tx_hash: hash,
          });
        })
      );

      if (err) {
        console.log('error here', err, txRes);
        return res.send(new BadRequestError(err.message));
      }
    } catch (e) {
      console.log('asfasfds', e);
      return res.send(new InternalServerError(e));
    }
    return next();
  }
}
