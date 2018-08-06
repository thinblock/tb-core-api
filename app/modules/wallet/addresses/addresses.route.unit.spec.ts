import * as chai from 'chai';
import * as supertest from 'supertest';
import * as sinon from 'sinon';
import { app } from '../../../../server';
import WalletAddress from '../../../models/wallet_address.model';
import Wallet from '../../../models/wallet.model';

const expect = chai.expect;
describe('Unit Testing', () => {
  const singleWalletObj = {
    'id': 1,
    'client_id': '1',
    'user_id': '2',
    'name': 'Really cool wallet',
    'created_at': '2018-08-02T06:19:31.051Z',
    'updated_at': '2018-08-02T06:19:31.051Z'
  };

  let sandbox: sinon.SinonSandbox = null;
  beforeEach((done) => {
    sandbox = sinon.createSandbox();
    done();
  });
  afterEach((done) => {
    sandbox.restore();
    done();
  });
  describe('Wallet Addresses API', () => {
    describe('GET /api/wallets/:id/addresses', () => {
      const addressObj = {
        result: [
          {
            id: 2,
            wallet_id: 1,
            chain: 'btc',
            address: '2x',
            name: 'btc address',
            created_at: '2018-08-02T06:26:54.472Z',
            updated_at: '2018-08-02T06:26:54.472Z'
          }
        ],
        total_results: 1
      };
      it('should get wallet addresses successfully', (done) => {
        sandbox
          .mock(Wallet)
          .expects('findOne')
          .resolves(singleWalletObj);
        sandbox
          .mock(WalletAddress)
          .expects('findAll')
          .resolves(addressObj);
        supertest(app)
          .get('/api/wallets/1/addresses')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              expect(res.body).to.have.deep.equals({ result: addressObj });
              done();
            }
          });
      });

      it('should throw bad request if wallet id is wrong', (done) => {
        sandbox
          .mock(WalletAddress)
          .expects('findAll')
          .resolves(null);
        supertest(app)
          .get('/api/wallets/asfdf/addresses')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(400);
              done();
            }
          });
      });

      it('should throw 404 if addresses for wallet id do not exist', (done) => {
        sandbox
          .mock(Wallet)
          .expects('findOne')
          .resolves(singleWalletObj);
        sandbox
          .mock(WalletAddress)
          .expects('findAll')
          .resolves(null);
        supertest(app)
          .get('/api/wallets/500/addresses')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(404);
              done();
            }
          });
      });

      it('should throw 500 if server error while reading db', (done) => {
        sandbox
          .mock(Wallet)
          .expects('findOne')
          .resolves(singleWalletObj);
        sandbox
          .mock(WalletAddress)
          .expects('findAll')
          .throws(null);
        supertest(app)
          .get('/api/wallets/5/addresses')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(500);
              done();
            }
          });
      });
    });
    describe('POST /api/wallets/:id/addresses', () => {
      const addressObj = {
        chain: 'eth',
        address: '1x',
        name: 'eth address'
      };

      const addressReturn = {
        walletAddress: {
          id: 3,
          chain: 'eth',
          address: '1x',
          name: 'eth address',
          wallet_id: 1,
          updated_at: '2018-08-02T07:00:49.026Z',
          created_at: '2018-08-02T07:00:49.026Z'
        }
      };

      it('should save wallet addresses successfully', (done) => {
        sandbox
          .mock(Wallet)
          .expects('findOne')
          .resolves(singleWalletObj);
        sandbox
          .mock(WalletAddress)
          .expects('create')
          .resolves(addressReturn);
        supertest(app)
          .post('/api/wallets/1/addresses')
          .send(addressObj)
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              expect(res.body).to.have.deep.equals(addressReturn);
              done();
            }
          });
      });

      it('should throw 500 if server error while writing db', (done) => {
        sandbox
          .mock(Wallet)
          .expects('findOne')
          .resolves(singleWalletObj);
        sandbox
          .mock(WalletAddress)
          .expects('create')
          .throws(null);
        supertest(app)
          .post('/api/wallets/1/addresses')
          .send(addressObj)
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(500);
              done();
            }
          });
      });
    });

    describe('DELETE /api/wallets/:id/addresses/:addressid', () => {
      it('should delete wallet address successfully', (done) => {
        sandbox
          .mock(Wallet)
          .expects('findOne')
          .resolves(singleWalletObj);
        sandbox
          .mock(WalletAddress)
          .expects('destroy')
          .resolves({ success: true, message: 'Wallet Address deleted successfully' });
        supertest(app)
          .delete('/api/wallets/1/addresses/1')
          .send()
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              expect(res.body).to.have.deep.equals({
                success: true,
                message: 'Wallet Address deleted successfully'
              });
              done();
            }
          });
      });

      it('should throw 500 if server error while deleting from db', (done) => {
        sandbox
          .mock(Wallet)
          .expects('findOne')
          .resolves(singleWalletObj);
        sandbox
          .mock(WalletAddress)
          .expects('destroy')
          .throws(null);
        supertest(app)
          .delete('/api/wallets/1/addresses/1')
          .send()
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(500);
              done();
            }
          });
      });
    });
  });
});