import * as chai from 'chai';
import * as supertest from 'supertest';
import * as sinon from 'sinon';
import { app } from '../../../../server';
import WalletUser from '../../../models/wallet_user.model';
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
  describe('Wallet Users API', () => {
    describe('GET /api/wallets/:id/authorized_users', () => {
      const userObj = {
        result: [
          {
            id: 1,
            wallet_id: 1,
            client_id: '1',
            user_id: '3',
            created_at: '2018-08-02T06:19:56.687Z',
            updated_at: '2018-08-02T06:19:56.687Z'
          }
        ],
        total_results: 1
      };

      it('should get wallet users successfully', (done) => {
        sandbox
          .mock(Wallet)
          .expects('findOne')
          .resolves(singleWalletObj);
        sandbox
          .mock(WalletUser)
          .expects('findAll')
          .resolves(userObj);
        supertest(app)
          .get('/api/wallets/1/authorized_users')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              expect(res.body).to.have.deep.equals({ result: userObj });
              done();
            }
          });
      });

      it('should throw bad request if wallet id is wrong', (done) => {
        sandbox
          .mock(WalletUser)
          .expects('findAll')
          .resolves(null);
        supertest(app)
          .get('/api/wallets/asfdf/authorized_users')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(400);
              done();
            }
          });
      });

      it('should throw 404 if users for wallet id do not exist', (done) => {
        sandbox
          .mock(Wallet)
          .expects('findOne')
          .resolves(singleWalletObj);
        sandbox
          .mock(WalletUser)
          .expects('findAll')
          .resolves(null);
        supertest(app)
          .get('/api/wallets/1/authorized_users')
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
          .mock(WalletUser)
          .expects('findAll')
          .throws(null);
        supertest(app)
          .get('/api/wallets/5/authorized_users')
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

    describe('POST /api/wallets/:id/authorized_users', () => {
      const singleWalletObj = {
        'id': 1,
        'client_id': '1',
        'user_id': '2',
        'name': 'Really cool wallet',
        'created_at': '2018-08-02T06:19:31.051Z',
        'updated_at': '2018-08-02T06:19:31.051Z'
      };

      const userObj = {
        user_id: '3'
      };

      const userReturn = {
        walletUser: {
          id: 3,
          user_id: '3',
          client_id: '1',
          wallet_id: 1,
          updated_at: '2018-08-02T07:09:09.345Z',
          created_at: '2018-08-02T07:09:09.345Z'
        }
      };

      it('should save wallet user successfully', (done) => {
        sandbox
          .mock(Wallet)
          .expects('findOne')
          .resolves(singleWalletObj);
        sandbox
          .mock(WalletUser)
          .expects('create')
          .resolves(userReturn);
        supertest(app)
          .post('/api/wallets/1/authorized_users')
          .send(userObj)
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              expect(res.body).to.have.deep.equals(userReturn);
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
          .mock(WalletUser)
          .expects('create')
          .throws(null);
        supertest(app)
          .post('/api/wallets/1/authorized_users')
          .send(userObj)
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

    describe('DELETE /api/wallets/:id/authorized_users/:userid', () => {
      it('should delete wallet user successfully', (done) => {
        sandbox
          .mock(Wallet)
          .expects('findOne')
          .resolves(singleWalletObj);
        sandbox
          .mock(WalletUser)
          .expects('destroy')
          .resolves({ success: true, message: 'Wallet User deleted successfully' });
        supertest(app)
          .delete('/api/wallets/1/authorized_users/1')
          .send()
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              expect(res.body).to.have.deep.equals({
                success: true, message: 'Wallet User deleted successfully'
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
          .mock(WalletUser)
          .expects('destroy')
          .throws(null);
        supertest(app)
          .delete('/api/wallets/1/authorized_users/1')
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