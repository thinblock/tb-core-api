import * as chai from 'chai';
import * as supertest from 'supertest';
import * as sinon from 'sinon';
import { app } from '../../../../server';
import web3 from '../../../../config/web3';
import Account from '../../../../app/models/account.model';
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

  describe('Eth Accounts Balance API', () => {
    describe('GET /api/eth/accounts/:account/balance', () => {
      it('should get balance of passed account', (done) => {
        const accResponse = {
          address: '0x96A467D2Da922D7d08cB77253686c9c1cFAF7239',
        };
        sandbox
          .mock(web3.eth)
          .expects('getBalance')
          .once()
          .resolves('3000000000000000');
        sandbox
          .mock(Account)
          .expects('findOne')
          .resolves(accResponse);

        supertest(app)
          .get('/api/eth/accounts/0x96A467D2Da922D7d08cB77253686c9c1cFAF7239/balance')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              expect(res.body)
                .to.have.deep
                .equals({
                  address: accResponse.address,
                  balance: '0.003',
                  unit: 'ether'
                });
              done();
            }
          });
      });

      it('should throw an error if wrong address length', (done) => {
        supertest(app)
          .get('/api/eth/accounts/0x96A467Da922D7d08cB77253686c9c1cFAF7239/balance')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(400);
              done();
            }
          });
      });

      it('should throw an error if wrong eth address', (done) => {
        supertest(app)
          .get('/api/eth/accounts/0x36346733D3323D73089B77253686c9414FAF7239/balance')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(400);
              done();
            }
          });
      });

      it('should throw not found error if address not found', (done) => {
        sandbox
          .mock(Account)
          .expects('findOne')
          .resolves(null);

        supertest(app)
          .get('/api/eth/accounts/0x96A467D2Da922D7d08cB77253686c9c1cFAF7239/balance')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(404);
              done();
            }
          });
      });

      it('should throw an error if db failed', (done) => {
        sandbox
          .mock(Account)
          .expects('findOne')
          .throws(new Error('Errored'));

        supertest(app)
          .get('/api/eth/accounts/0x96A467D2Da922D7d08cB77253686c9c1cFAF7239/balance')
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
