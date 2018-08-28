import * as chai from 'chai';
import * as supertest from 'supertest';
import * as sinon from 'sinon';
import { app } from '../../../server';
import Device from '../../models/device.model';

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
  describe('Devices API', () => {
    describe('GET /api/devices', () => {
      const deviceObj = {
        result: [
          {
            id: 1,
            client_id: '8718e710-03d9-42b8-2588-d020x1995dd0',
            UUID: '123-456-789',
            user_id: '123',
            created_at: '2018-08-03T06:09:19.594Z',
            updated_at: '2018-08-03T06:09:19.594Z'
          }
        ],
        total_results: 1
      };

      it('should get devices successfully', (done) => {
        sandbox
          .mock(Device)
          .expects('findAll')
          .withArgs({
            where: {
              client_id: undefined,
              user_id: '123'
            }
          })
          .resolves(deviceObj);
        supertest(app)
          .get('/api/devices?user_id=123')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              expect(res.body).to.have.deep.equals({ result: deviceObj });
              done();
            }
          });
      });

      it('should get device successfully', (done) => {
        sandbox
          .mock(Device)
          .expects('findOne')
          .withArgs({
            where: {
              id: '1',
              client_id: undefined,
              user_id: '123'
            }
          })
          .resolves(deviceObj.result[0]);
        supertest(app)
          .get('/api/devices/1?user_id=123')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              expect(res.body).to.have.deep.equals(deviceObj.result[0]);
              done();
            }
          });
      });

      it('should throw 400 internal server error if user id is not provided', (done) => {
        sandbox
          .mock(Device)
          .expects('findOne')
          .withArgs({
            where: {
              id: 'asfd',
              client_id: undefined,
              user_id: '123'
            }
          })
          .resolves(Error);
        supertest(app)
          .get('/api/devices/asfdf')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(400);
              done();
            }
          });
      });

      it('should throw 500 internal server error if device id is wrong', (done) => {
        sandbox
          .mock(Device)
          .expects('findOne')
          .withArgs({
            where: {
              id: 'asfd',
              client_id: undefined,
              user_id: '123'
            }
          })
          .resolves(Error);
        supertest(app)
          .get('/api/devices/asfdf?user_id=123')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(500);
              done();
            }
          });
      });

      it('should throw 404 if device id does not exist', (done) => {
        sandbox
          .mock(Device)
          .expects('findOne')
          .withArgs({
            where: {
              id: '5',
              client_id: undefined,
              user_id: '123'
            }
          })
          .resolves(null);
        supertest(app)
          .get('/api/devices/5?user_id=123')
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
          .mock(Device)
          .expects('findOne')
          .withArgs({
            where: {
              id: '53',
              client_id: undefined,
              user_id: '123'
            }
          })
          .throws(null);
        supertest(app)
          .get('/api/devices/53?user_id=123')
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

    describe('POST /api/devices/', () => {
      const deviceRequest = {
        UUID: '123-456-789',
        user_id: '123'
      };
      const deviceReturn = {
        id: 1,
        client_id: '8718e710-03d9-42b8-2588-d020x1995dd0',
        UUID: '123-456-789',
        created_at: '2018-08-03T06:09:19.594Z',
        updated_at: '2018-08-03T06:09:19.594Z'
      };

      it('should save device successfully', (done) => {
        sandbox
          .mock(Device)
          .expects('create')
          .withArgs({
            client_id: undefined,
            UUID: '123-456-789',
            user_id: '123'
          })
          .resolves(deviceReturn);
        supertest(app)
          .post('/api/devices')
          .send(deviceRequest)
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
          .mock(Device)
          .expects('create')
          .withArgs({
            client_id: undefined,
            UUID: '123-456-789',
            user_id: '123'
          })
          .throws(null);
        supertest(app)
          .post('/api/devices')
          .send(deviceRequest)
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

    describe('DELETE /api/devices/', () => {
      it('should save device successfully', (done) => {
        sandbox
          .mock(Device)
          .expects('destroy')
          .withArgs({
            where: {
              id: '1',
              client_id: undefined,
              user_id: '123'
            },
          })
          .resolves({});
        supertest(app)
          .delete('/api/devices/1?user_id=123')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              done();
            }
          });
      });

      it('should throw 500 if server error while delete db record', (done) => {
        sandbox
          .mock(Device)
          .expects('destroy')
          .withArgs({
            where: {
              id: '1',
              client_id: undefined,
              user_id: '123'
            },
          })
          .throws(null);
        supertest(app)
          .delete('/api/devices/1?user_id=123')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(500);
              done();
            }
          });
      });

      it('should throw 404 if device id does not exist', (done) => {
        sandbox
          .mock(Device)
          .expects('destroy')
          .withArgs({
            where: {
              id: '1',
              client_id: undefined,
              user_id: '123'
            },
          })
          .resolves(null);
        supertest(app)
          .delete('/api/devices/1?user_id=123')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(404);
              done();
            }
          });
      });
    });
  });
});