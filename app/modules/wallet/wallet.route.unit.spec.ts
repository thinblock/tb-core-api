import * as chai from 'chai';
import * as supertest from 'supertest';
import * as sinon from 'sinon';
import { app } from '../../../server';
import Wallet from '../../models/wallet.model';

const expect = chai.expect;
describe('Unit Testing', () => {
  let sandbox: sinon.SinonSandbox = null;
  beforeEach((done) => {
    sandbox = sinon.createSandbox();
    done();
  });
  afterEach((done) => {
    sandbox.restore();
    done();
  });
  describe('Wallet API', () => {
    describe('GET /api/wallets', () => {
      const walletObj = {
        result: [
          {
            'id': 1,
            'client_id': '1',
            'user_id': '2',
            'name': 'Really cool wallet',
            'created_at': '2018-08-02T06:19:31.051Z',
            'updated_at': '2018-08-02T06:19:31.051Z'
          }
        ],
        total_results: 1
      };

      it('should get wallets successfully', (done) => {
        sandbox
          .mock(Wallet)
          .expects('findAll')
          .resolves(walletObj);
        supertest(app)
          .get('/api/wallets')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              expect(res.body).to.have.deep.equals({ result: walletObj });
              done();
            }
          });
      });
      it('should throw 500 internal server error if wallet id is wrong', (done) => {
        sandbox
          .mock(Wallet)
          .expects('findOne')
          .resolves(Error);
        supertest(app)
          .get('/api/wallets/asfdf')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(500);
              done();
            }
          });
      });
      it('should throw 404 if wallet id does not exist', (done) => {
        sandbox
          .mock(Wallet)
          .expects('findOne')
          .resolves(null);
        supertest(app)
          .get('/api/wallets/5')
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
          .throws(null);
        supertest(app)
          .get('/api/wallets/53')
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
    describe('POST /api/wallets/', () => {
      const walletObj = {
        name: 'Test wallet',
        user_id: '2u'
      };
      const walletReturn = {
        wallet: {
          id: 2,
          client_id: '1',
          user_id: '233',
          name: 'Testing wallet',
          updated_at: '2018-08-02T06:42:33.342Z',
          created_at: '2018-08-02T06:42:33.342Z'
        }
      };
      it('should save wallet successfully', (done) => {
        sandbox
          .mock(Wallet)
          .expects('create')
          .resolves(walletReturn);
        supertest(app)
          .post('/api/wallets')
          .send(walletObj)
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              done();
            }
          });
      });
      it('should throw 500 if server error while writing db', (done) => {
        sandbox
          .mock(Wallet)
          .expects('create')
          .throws(null);
        supertest(app)
          .post('/api/wallets')
          .send(walletObj)
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