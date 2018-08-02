import * as chai from 'chai';
import * as supertest from 'supertest';
import * as sinon from 'sinon';
import { app } from '../../../server';
import Key from '../../../app/models/key.model';
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

  describe('Keys API', () => {
    describe('GET /api/keys/:id', () => {
      const keyObj = {
        created_at: '2018-07-30T11:34:45.141Z',
        encrypted_key: '96A467D2Da922D7d08cB77253686c9c1cFAF723908cB77253686c9c1cFAF7239',
        id: 1,
        user_id: '29'
      };

      it('should get key successfully', (done) => {
        sandbox
          .mock(Key)
          .expects('findOne')
          .resolves(keyObj);

        supertest(app)
          .get('/api/keys/1')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              expect(res.body).to.have.deep.equals(keyObj);
              done();
            }
          });
      });

      it('should throw bad request if wrong key id', (done) => {
        supertest(app)
          .get('/api/keys/asdf')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(400);
              done();
            }
          });
      });

      it('should throw 404 if key does not exist', (done) => {
        sandbox
          .mock(Key)
          .expects('findOne')
          .resolves(null);
        supertest(app)
          .get('/api/keys/1')
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
          .mock(Key)
          .expects('findOne')
          .throws(null);

        supertest(app)
          .get('/api/keys/1')
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

    describe('POST /api/keys/', () => {
      const keyObj = {
        created_at: '2018-07-30T11:34:45.141Z',
        encrypted_key: '96A467D2Da922D7d08cB77253686c9c1cFAF723908cB77253686c9c1cFAF7239',
        id: 1,
        user_id: '29'
      };

      it('should save encrypted key successfully', (done) => {
        sandbox
          .mock(Key)
          .expects('create')
          .resolves(keyObj);

        supertest(app)
          .post('/api/keys')
          .send({ encrypted_key: 'asfd', user_id: '23' })
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              expect(res.body.key_id).to.equal(1);
              done();
            }
          });
      });

      it('should throw 500 if server error while writing db', (done) => {
        sandbox
          .mock(Key)
          .expects('create')
          .throws(null);

        supertest(app)
          .post('/api/keys')
          .send({ encrypted_key: 'asdf', user_id: '2' })
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
