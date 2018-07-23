import * as chai from 'chai';
import * as supertest from 'supertest';
import * as sinon from 'sinon';
import { app } from '../../../../server';
import PromiEvent from 'promievent';
import web3 from '../../../../config/web3';
const expect = chai.expect;

describe('Unit Testing', () => {
  let sandbox: sinon.SinonSandbox = null;
  const txPayload = {
    to: '0x96A467D2Da922D7d08cB77253686c9c1cFAF7239',
    gas: '15000',
    value: '0.003',
    private_key: '0x96A467D2Da922D7d08cB77253686c9c1cFAF723908cB77253686c9c1cFAF7239'
  };

  beforeEach((done) => {
    sandbox = sinon.createSandbox();
    done();
  });

  afterEach((done) => {
    sandbox.restore();
    done();
  });

  describe('Eth Accounts Transactions API', () => {
    describe('POST /api/eth/accounts/:account/transactions', () => {
      it('should create eth transaction', (done) => {
        const txHash = '0xHash';
        const promiEvent = new PromiEvent((resolve: any) => {
          setTimeout(() => {
            promiEvent.emit('transactionHash', txHash);
            resolve('something');
          }, 25);
        });
        sandbox
          .mock(web3.eth.accounts)
          .expects('signTransaction')
          .once()
          .resolves({ rawTransaction: '0x32329adsfs4232339' });
        sandbox
          .mock(web3.eth)
          .expects('sendSignedTransaction')
          .withArgs('0x32329adsfs4232339')
          .once()
          .returns(promiEvent);

        supertest(app)
          .post('/api/eth/accounts/0x96A467D2Da922D7d08cB77253686c9c1cFAF7239/transactions')
          .send(txPayload)
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              expect(res.body).to.have.deep.equals({
                success: true,
                message: 'Transaction was successfull!',
                tx_hash: txHash,
              });
              done();
            }
          });
      });

      it('should throw 500 if signing fails', (done) => {
        sandbox
          .mock(web3.eth.accounts)
          .expects('signTransaction')
          .once()
          .rejects(new Error('error'));

        supertest(app)
          .post('/api/eth/accounts/0x96A467D2Da922D7d08cB77253686c9c1cFAF7239/transactions')
          .send(txPayload)
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(500);
              done();
            }
          });
      });

      it('should throw 400 if sending signed transaction fails', (done) => {
        const promiEvent = new PromiEvent((resolve: any, reject: any) => {
          setTimeout(() => {
            reject(new Error('error sending transaction'));
          }, 30);
        });
        sandbox
          .mock(web3.eth.accounts)
          .expects('signTransaction')
          .once()
          .resolves({ rawTransaction: '0x32329adsfs4232339' });
        sandbox
          .mock(web3.eth)
          .expects('sendSignedTransaction')
          .withArgs('0x32329adsfs4232339')
          .once()
          .returns(promiEvent);

        supertest(app)
          .post('/api/eth/accounts/0x96A467D2Da922D7d08cB77253686c9c1cFAF7239/transactions')
          .send(txPayload)
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(400);
              done();
            }
          });
      });

      it('should throw bad request if no body', (done) => {
        supertest(app)
          .post('/api/eth/accounts/0x96A467D2Da922D7d08cB77253686c9c1cFAF7239/transactions')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(400);
              done();
            }
          });
      });

      it('should throw bad request if param account is not correct eth address', (done) => {
        supertest(app)
          .post('/api/eth/accounts/0x96A467D2Da922D7dddcB77253686c9c1cFAF7239/transactions')
          .send(txPayload)
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(400);
              done();
            }
          });
      });

      it('should throw bad request if "to" in payload is not correct eth address', (done) => {
        const localPayload = { ...txPayload, to: '0x96A467D2Da922D7dddcB77253686c9c1cFAF7239' };
        supertest(app)
          .post('/api/eth/accounts/0x96A467D2Da922D7d08cB77253686c9c1cFAF7239/transactions')
          .send(localPayload)
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(400);
              done();
            }
          });
      });

      it('should throw bad request if "private_key" in payload is not correct hex key', (done) => {
        const localPayload = {
          ...txPayload,
          private_key: '0xabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghiljk'
        };
        supertest(app)
          .post('/api/eth/accounts/0x96A467D2Da922D7d08cB77253686c9c1cFAF7239/transactions')
          .send(localPayload)
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(400);
              done();
            }
          });
      });

    });

  });
});
