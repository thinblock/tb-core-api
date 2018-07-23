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

  describe('Eth Accounts API', () => {
    describe('POST /api/eth/accounts', () => {
      it('should create eth account', (done) => {
        const web3Response = {
          address: 'fake',
          privateKey: 'fake_key'
        };
        sandbox
          .mock(web3.eth.accounts)
          .expects('create')
          .once()
          .returns(web3Response);
        sandbox
          .mock(Account)
          .expects('create')
          .resolves(web3Response);

        supertest(app)
          .post('/api/eth/accounts?key_action=return_private_key')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              expect(res.body).to.have.deep.equals(web3Response);
              done();
            }
          });
      });

      it('should throw an error if web3 failed', (done) => {
        sandbox
          .mock(web3.eth.accounts)
          .expects('create')
          .once()
          .throws(new Error('Errored'));

        supertest(app)
          .post('/api/eth/accounts?key_action=return_private_key')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(500);
              done();
            }
          });
      });

      it('should throw bad request if no query param', (done) => {
        supertest(app)
          .post('/api/eth/accounts')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(400);
              done();
            }
          });
      });

      it('should throw bad request if bad query param used', (done) => {
        supertest(app)
          .post('/api/eth/accounts?key_action=fail')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(400);
              done();
            }
          });
      });

      it('should throw an error if error saving to db', (done) => {
        const web3Response = {
          address: 'fake',
          privateKey: 'fake_key'
        };
        sandbox
          .mock(web3.eth.accounts)
          .expects('create')
          .once()
          .returns(web3Response);
        sandbox
          .mock(Account)
          .expects('create')
          .throws(new Error('errored'));

        supertest(app)
          .post('/api/eth/accounts?key_action=return_private_key')
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

    describe('GET /api/eth/accounts', () => {
      it('should get all eth accounts', (done) => {
        const accResponse = [{
          address: 'fake',
        }];
        sandbox
          .mock(Account)
          .expects('findAll')
          .resolves(accResponse);

        supertest(app)
          .get('/api/eth/accounts')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              expect(res.body)
                .to.have.deep
                .equals({
                  total: accResponse.length,
                  total_pages: 1,
                  result: accResponse
                });
              done();
            }
          });
      });

      it('should get all eth accounts with balance when include_balance=true', (done) => {
        const accResponse = [{
          address: 'fake',
        }];
        sandbox
          .mock(web3.eth)
          .expects('getBalance')
          .once()
          .resolves('3000000000000000');
        sandbox
          .mock(Account)
          .expects('findAll')
          .resolves(accResponse);

        supertest(app)
          .get('/api/eth/accounts?include_balance=true')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              expect(res.body)
                .to.have.deep
                .equals({
                  total: accResponse.length,
                  total_pages: 1,
                  result: accResponse.map((ac: any) => {
                    ac.balance = '0.003';
                    return ac;
                  })
                });
              done();
            }
          });
      });

      it('should mark balance as null when include_balance=true and web3 error', (done) => {
        const accResponse = [{
          address: 'fake',
        }];
        sandbox
          .mock(web3.eth)
          .expects('getBalance')
          .once()
          .rejects('error');
        sandbox
          .mock(Account)
          .expects('findAll')
          .resolves(accResponse);

        supertest(app)
          .get('/api/eth/accounts?include_balance=true')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              expect(res.body)
                .to.have.deep
                .equals({
                  total: accResponse.length,
                  total_pages: 1,
                  result: accResponse.map((ac: any) => {
                    ac.balance = null;
                    return ac;
                  })
                });
              done();
            }
          });
      });

      it('should throw an error if db failed', (done) => {
        sandbox
          .mock(Account)
          .expects('findAll')
          .throws(new Error('Errored'));

        supertest(app)
          .get('/api/eth/accounts')
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
