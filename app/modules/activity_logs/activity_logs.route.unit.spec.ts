import * as chai from 'chai';
import * as supertest from 'supertest';
import * as sinon from 'sinon';
import { app } from '../../../server';
import ActivityLog from '../../../app/models/activity_log.model';
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

  describe('Activity Logs API', () => {
    const logs = [{
      created_at: '2018-07-30T11:34:45.141Z',
      client_id: '328adsf8-asdf8fads-328989asdf-asdf',
      log: 'User created',
      id: 1,
      user_id: '29'
    }];

    describe('GET /api/activity_logs', () => {
      it('should get all logs successfully', (done) => {
        sandbox
          .mock(ActivityLog)
          .expects('findAll')
          .withArgs({
            where: { client_id: undefined },
            attributes: { exclude: ['data', 'client_id'] },
          })
          .resolves(logs);

        supertest(app)
          .get('/api/activity_logs')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              expect(res.body).to.have.deep.equals({
                result: logs
              });
              done();
            }
          });
      });

      it('should filter by user_id if found in query param', (done) => {
        sandbox
          .mock(ActivityLog)
          .expects('findAll')
          .withArgs({
            where: { client_id: undefined, user_id: '209' },
            attributes: { exclude: ['data', 'client_id'] },
          })
          .resolves(logs);

        supertest(app)
          .get('/api/activity_logs?user_id=209')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              done();
            }
          });
      });

      it('should throw 500 if server error while reading db', (done) => {
        sandbox
          .mock(ActivityLog)
          .expects('findAll')
          .throws(null);

        supertest(app)
          .get('/api/activity_logs')
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
