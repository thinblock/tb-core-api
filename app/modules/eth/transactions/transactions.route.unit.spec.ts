import * as chai from 'chai';
import * as supertest from 'supertest';
import * as sinon from 'sinon';
import { app } from '../../../../server';
import PromiEvent from 'promievent';
import web3 from '../../../../config/web3';
import Account from '../../../models/account.model';
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


    describe('GET /api/eth/accounts/:account/transactions/:tx_hash', () => {

      const txResponse = {
        amount: {
          unit: 'ether',
          value: '0.0003'
        },
        block: {
          hash: '0x27c6327d14aae64247679c1e2ba2d627b14abde146df8fc44f8d552d66a10e49',
          number: 3696038
        },
        gas: {
          price: '15000',
          total_block_usage: 72983,
          tx_specified: 4712394,
          tx_usage: 21000
        },
        receiver: '0x96A467D2Da922D7d08cB77253686c9c1cFAF7239',
        sender: '0x131AD391cB7098299B36220f6BE2089b1387B501',
        status: 'verified',
        tx_hash: '0x8236885c2266fb89f0078a77e8d12bc5e560d227520986bbc0ccfb47b9d99328',
        tx_index: 1
      };
      const getTransactionRes = {
        blockHash: '0x27c6327d14aae64247679c1e2ba2d627b14abde146df8fc44f8d552d66a10e49',
        blockNumber: 3696038,
        from: '0x131AD391cB7098299B36220f6BE2089b1387B501',
        gas: 4712394,
        gasPrice: '15000',
        hash: '0x8236885c2266fb89f0078a77e8d12bc5e560d227520986bbc0ccfb47b9d99328',
        input: '0x',
        nonce: 2,
        to: '0x96A467D2Da922D7d08cB77253686c9c1cFAF7239',
        transactionIndex: 1,
        value: '300000000000000'
      };
      const getTransactionReceiptRes = {
        cumulativeGasUsed: 72983,
        gasUsed: 21000,
        status: true
      };
      const txHash = txResponse.tx_hash;
      const account = '0x96A467D2Da922D7d08cB77253686c9c1cFAF7239';


      it('should fetch eth verified transaction', (done) => {

        sandbox
          .mock(Account)
          .expects('findOne')
          .once()
          .resolves({ something: 'fake' });
        sandbox
          .mock(web3.eth)
          .expects('getTransaction')
          .withArgs(txHash)
          .once()
          .resolves(getTransactionRes);
        sandbox
          .mock(web3.eth)
          .expects('getTransactionReceipt')
          .withArgs(txHash)
          .once()
          .resolves(getTransactionReceiptRes);

        supertest(app)
          .get(`/api/eth/accounts/${account}/transactions/${txHash}`)
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              expect(res.body).to.have.deep.equals(txResponse);
              done();
            }
          });
      });

      it('should return pending status if transaction is pending', (done) => {
        const localGetTransactionRes = {
          ...getTransactionRes,
          blockHash: <any>null,
          blockNumber: <any>null
        };
        const localTxRes = {
          ...txResponse,
          block: {
            hash: <any>null,
            number: <any>null
          },
          gas: {
            ...txResponse.gas,
            total_block_usage: <any>null,
            tx_usage: <any>null
          },
          status: 'pending'
        };

        sandbox
          .mock(Account)
          .expects('findOne')
          .once()
          .resolves({ something: 'fake' });
        sandbox
          .mock(web3.eth)
          .expects('getTransaction')
          .withArgs(txHash)
          .once()
          .resolves(localGetTransactionRes);

        supertest(app)
          .get(`/api/eth/accounts/${account}/transactions/${txHash}`)
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              expect(res.body).to.have.deep.equals(localTxRes);
              done();
            }
          });
      });

      it('should return reverted status if transaction was reverted', (done) => {

        sandbox
          .mock(Account)
          .expects('findOne')
          .once()
          .resolves({ something: 'fake' });
        sandbox
          .mock(web3.eth)
          .expects('getTransaction')
          .withArgs(txHash)
          .once()
          .resolves(getTransactionRes);
        sandbox
          .mock(web3.eth)
          .expects('getTransactionReceipt')
          .withArgs(txHash)
          .once()
          .resolves({ ...getTransactionReceiptRes, status: false });

        supertest(app)
          .get(`/api/eth/accounts/${account}/transactions/${txHash}`)
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              expect(res.body).to.have.deep.equals({ ...txResponse, status: 'reverted' });
              done();
            }
          });
      });

      it('should throw 404 if account was not found', (done) => {

        sandbox
          .mock(Account)
          .expects('findOne')
          .once()
          .resolves(null);
        sandbox
          .mock(web3.eth)
          .expects('getTransaction')
          .withArgs(txHash)
          .once()
          .resolves(null);

        supertest(app)
          .get(`/api/eth/accounts/${account}/transactions/${txHash}`)
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(404);
              done();
            }
          });
      });

      it('should throw 404 if tx was not found', (done) => {

        sandbox
          .mock(Account)
          .expects('findOne')
          .once()
          .resolves(null);

        supertest(app)
          .get(`/api/eth/accounts/${account}/transactions/${txHash}`)
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(404);
              done();
            }
          });
      });

      it('should throw 500 if error while retrieving transaction', (done) => {

        sandbox
          .mock(Account)
          .expects('findOne')
          .once()
          .resolves({ something: 'fake' });
        sandbox
          .mock(web3.eth)
          .expects('getTransaction')
          .withArgs(txHash)
          .once()
          .rejects(getTransactionRes);

        supertest(app)
          .get(`/api/eth/accounts/${account}/transactions/${txHash}`)
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(500);
              done();
            }
          });
      });

      it('should throw 500 if error while retrieving transaction receipt', (done) => {

        sandbox
          .mock(Account)
          .expects('findOne')
          .once()
          .resolves({ something: 'fake' });
        sandbox
          .mock(web3.eth)
          .expects('getTransaction')
          .withArgs(txHash)
          .once()
          .resolves(getTransactionRes);
        sandbox
          .mock(web3.eth)
          .expects('getTransactionReceipt')
          .withArgs(txHash)
          .once()
          .rejects({ ...getTransactionReceiptRes, status: false });

        supertest(app)
          .get(`/api/eth/accounts/${account}/transactions/${txHash}`)
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(500);
              done();
            }
          });
      });

      it('should throw 500 if error while reading accounts', (done) => {

        sandbox
          .mock(Account)
          .expects('findOne')
          .once()
          .rejects(null);

        supertest(app)
          .get(`/api/eth/accounts/${account}/transactions/${txHash}`)
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(500);
              done();
            }
          });
      });

      it('should throw bad request if error tx_hash is not proper hex string', (done) => {

        supertest(app)
          .get(`/api/eth/accounts/${account}/transactions/${txHash.replace(/[abcde]/g, 'L')}`)
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(400);
              done();
            }
          });
      });

      it('should throw bad request if error account is not proper hex string', (done) => {

        supertest(app)
          .get(`/api/eth/accounts/${account.replace(/[abcde]/g, 'L')}/transactions/${txHash}`)
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(400);
              done();
            }
          });
      });

      it('should throw bad request if account length is not 42', (done) => {

        supertest(app)
          .get(`/api/eth/accounts/${account.replace(/[abcde]/g, '')}/transactions/${txHash}`)
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(400);
              done();
            }
          });
      });

      it('should throw bad request if tx_hash length is not 66', (done) => {

        supertest(app)
          .get(`/api/eth/accounts/${account}/transactions/${txHash.replace(/[abcde]/g, '')}`)
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
