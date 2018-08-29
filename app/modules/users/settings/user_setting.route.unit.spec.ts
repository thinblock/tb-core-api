import * as chai from 'chai';
import * as supertest from 'supertest';
import * as sinon from 'sinon';
import { app } from '../../../../server';
import UserSetting from '../../../../app/models/user_setting.model';
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

  describe('User Setting API', () => {
    describe('PUT /api/users/me/settings', () => {
      it('should enable 2fa for user', (done) => {
        sandbox
          .mock(UserSetting)
          .expects('update')
          .resolves({ success: true, message: 'Updated profile' });
        supertest(app)
          .put('/api/users/me/settings')
          .send({ phone: '123456', enable_otp: true, user_id: 1 })
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              expect(res.body).to.have.property('success');
              expect(res.body).to.have.property('message');
              done();
            }
          });
      });

      it('should disable 2fa for user', (done) => {
        sandbox
          .mock(UserSetting)
          .expects('update')
          .resolves({ success: true, message: 'Updated profile' });
        supertest(app)
          .put('/api/users/me/settings')
          .send({ phone: '123456', enable_otp: false, user_id: 1 })
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              expect(res.body).to.have.property('success');
              expect(res.body).to.have.property('message');
              done();
            }
          });
      });

      it('should return 500 if error writing user', (done) => {
        sandbox
          .mock(UserSetting)
          .expects('update')
          .throws(null);
        supertest(app)
          .put('/api/users/me/settings')
          .send({ phone: '123456', enable_otp: true, user_id: 1 })
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