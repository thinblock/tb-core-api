import * as chai from 'chai';
import * as supertest from 'supertest';
import * as sinon from 'sinon';
import { app } from '../../../../server';
import User from '../../../../app/models/user.model';
import UserSetting from '../../../../app/models/user_setting.model';
import PhoneVerification from '../../../../app/models/phone_verification_code.model';
import * as OTP from '../../../../utils/otp/otp';
const expect = chai.expect;

describe('Unit Testing', () => {
  let sandbox: sinon.SinonSandbox = null;
  let user: any = null;
  let phoneVerification: any = null;
  beforeEach((done) => {
    sandbox = sinon.createSandbox();
    user = <any> {
      id: 1,
      email: 'testing@gmail.com',
      name: 'test',
      phone: '123456'
    };

    phoneVerification = <any> {
      id: 1,
      code: '1234',
      phone: '123456'
    };
    done();
  });

  afterEach((done) => {
    sandbox.restore();
    done();
  });

  describe('Two Factor Authorization API', () => {
    describe('POST /api/auth/2fa', () => {
      it('should create token and login', (done) => {
        sandbox
          .mock(User)
          .expects('findOne')
          .withArgs({
            where: { phone: '123456' }
          })
          .resolves(user);
        sandbox
          .mock(PhoneVerification)
          .expects('findOne')
          .withArgs({
            where: { user_id: undefined }
          })
          .resolves(phoneVerification);
        sandbox
          .mock(OTP)
          .expects('verifyCode')
          .withArgs('1234', 1)
          .resolves({ success: true, message: 'Correct OTP entered' });
        supertest(app)
          .post('/api/auth/2fa')
          .send({ phone: '123456', otp: '1234' })
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              expect(res.body).to.have.property('access_token');
              expect(res.body).to.have.property('user');
              done();
            }
          });
      });

      it('should return expiration message', (done) => {
        sandbox
          .mock(User)
          .expects('findOne')
          .withArgs({
            where: { phone: '123456' }
          })
          .resolves(user);
        sandbox
          .mock(PhoneVerification)
          .expects('findOne')
          .withArgs({
            where: { user_id: undefined }
          })
          .resolves(phoneVerification);
        sandbox
          .mock(OTP)
          .expects('verifyCode')
          .resolves({ error: true, message: 'Code has expired' });
        supertest(app)
          .post('/api/auth/2fa')
          .send({ phone: '123456', otp: '12345' })
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              expect(res.body).to.have.property('error');
              expect(res.body).to.have.property('message');
              expect(res.body.message).to.equal('Code has expired');
              done();
            }
          });
      });

      it('should return inocrrect OTP message', (done) => {
        sandbox
          .mock(User)
          .expects('findOne')
          .withArgs({
            where: { phone: '123456' }
          })
          .resolves(user);
        sandbox
          .mock(PhoneVerification)
          .expects('findOne')
          .withArgs({
            where: { user_id: undefined }
          })
          .resolves(phoneVerification);
        sandbox
          .mock(PhoneVerification)
          .expects('update')
          .withArgs({
            attempts: undefined,
            where: { id: undefined }
          })
          .resolves({
            ...phoneVerification,
            attempts: phoneVerification.attempts + 1
          });
        sandbox
          .mock(OTP)
          .expects('verifyCode')
          .resolves({ error: true, message: 'Wrong OTP entered' });
        supertest(app)
          .post('/api/auth/2fa')
          .send({ phone: '123456', otp: '12345' })
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              expect(res.body).to.have.property('error');
              expect(res.body).to.have.property('message');
              expect(res.body.message).to.equal('Wrong OTP entered');
              done();
            }
          });
      });

      it('should return user blocked message', (done) => {
        let phoneVerificationMax = {
          ...phoneVerification,
          attempts: 4
        };
        sandbox
          .mock(User)
          .expects('findOne')
          .withArgs({
            where: { phone: '123456' }
          })
          .resolves(user);
        sandbox
          .mock(PhoneVerification)
          .expects('findOne')
          .withArgs({
            where: { phone: '123456' }
          })
          .resolves(phoneVerification);
        sandbox
          .mock(PhoneVerification)
          .expects('update')
          .withArgs({
            attempts: undefined,
            where: { id: undefined }
          })
          .resolves({
            ...phoneVerification,
            attempts: phoneVerification.attempts + 1
          });
        sandbox
          .mock(OTP)
          .expects('verifyCode')
          .resolves({
            error: true, message: 'Too many attempts - Blocking account'
          });
        supertest(app)
          .post('/api/auth/2fa')
          .send({ phone: '123456', otp: '12345' })
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              expect(res.body).to.have.property('error');
              expect(res.body).to.have.property('message');
              expect(res.body.message).to.equal('Too many attempts - Blocking account');
              done();
            }
          });
      });

      it('should return 500 if error reading user', (done) => {
        sandbox
          .mock(User)
          .expects('findOne')
          .withArgs({
            where: { phone: '123456' }
          })
          .rejects(user);
        supertest(app)
          .post('/api/auth/2fa')
          .send({ phone: '123456', otp: '12345' })
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
