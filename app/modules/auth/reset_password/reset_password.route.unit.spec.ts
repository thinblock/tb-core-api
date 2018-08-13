import * as chai from 'chai';
import * as supertest from 'supertest';
import * as sinon from 'sinon';
import { app } from '../../../../server';
import * as bcrypt from 'bcrypt';
import * as emailService from '../../../../utils/email_service';
import * as helpers from '../../../../utils/helpers';
import User from '../../../../app/models/user.model';
import { UserStatuses, EmailTypes } from '../../../../app/interfaces/enums';
const expect = chai.expect;

describe('Unit Testing', () => {
  let sandbox: sinon.SinonSandbox = null;
  let user: any = null;
  let helperRes: any = null;
  beforeEach((done) => {
    sandbox = sinon.createSandbox();
    user = <any> {
      id: 1,
      email: 'testing@gmail.com',
      name: 'test',
      status: UserStatuses.ACTIVE,
      reset_password_token: 'token',
    };
    helperRes = {
      token: 'token',
      link: 'link'
    };
    done();
  });

  afterEach((done) => {
    sandbox.restore();
    done();
  });

  describe('Reset Password API', () => {

    describe('POST /api/auth/reset_password', () => {
      it('should create token and send email successfully', (done) => {
        sandbox
          .mock(helpers)
          .expects('generatePasswordResetLink')
          .once()
          .returns(helperRes);
        sandbox
          .mock(bcrypt)
          .expects('hashSync')
          .withExactArgs(helperRes.token, 12)
          .once()
          .returns('hashed_token');
        sandbox
          .mock(emailService)
          .expects('sendEmail')
          .withExactArgs(user.email, user.name, EmailTypes.RESET_PASSWORD, helperRes)
          .resolves({ success: true });
        sandbox
          .mock(User)
          .expects('findOne')
          .withExactArgs({
            where: { email: user.email }
          })
          .resolves(user);
        sandbox
          .mock(User)
          .expects('update')
          .withExactArgs({
            reset_password_token: 'hashed_token',
            reset_password_attempts: 0
          }, {
            where: { id: user.id }
          })
          .resolves(user);

        supertest(app)
          .post('/api/auth/reset_password')
          .send({ email: user.email })
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              expect(res.body.success).to.equal(true);
              done();
            }
          });
      });

      it('should return 500 if error reading user', (done) => {
        sandbox
          .mock(User)
          .expects('findOne')
          .withExactArgs({
            where: { email: user.email }
          })
          .rejects(user);

        supertest(app)
          .post('/api/auth/reset_password')
          .send({ email: user.email })
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(500);
              done();
            }
          });
      });

      it('should return 500 if error updating user', (done) => {
        sandbox
          .mock(helpers)
          .expects('generatePasswordResetLink')
          .once()
          .returns(helperRes);
        sandbox
          .mock(bcrypt)
          .expects('hashSync')
          .withExactArgs(helperRes.token, 12)
          .once()
          .returns('hashed_token');
        sandbox
          .mock(User)
          .expects('findOne')
          .withExactArgs({
            where: { email: user.email }
          })
          .resolves(user);
        sandbox
          .mock(User)
          .expects('update')
          .withExactArgs({
            reset_password_token: 'hashed_token',
            reset_password_attempts: 0
          }, {
            where: { id: user.id }
          })
          .rejects(user);

        supertest(app)
          .post('/api/auth/reset_password')
          .send({ email: user.email })
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(500);
              done();
            }
          });
      });

      it('should return 500 if error sending email', (done) => {
        sandbox
          .mock(helpers)
          .expects('generatePasswordResetLink')
          .once()
          .returns(helperRes);
        sandbox
          .mock(bcrypt)
          .expects('hashSync')
          .withExactArgs(helperRes.token, 12)
          .once()
          .returns('hashed_token');
        sandbox
          .mock(emailService)
          .expects('sendEmail')
          .withExactArgs(user.email, user.name, EmailTypes.RESET_PASSWORD, helperRes)
          .rejects({ error: true });
        sandbox
          .mock(User)
          .expects('findOne')
          .withExactArgs({
            where: { email: user.email }
          })
          .resolves(user);
        sandbox
          .mock(User)
          .expects('update')
          .withExactArgs({
            reset_password_token: 'hashed_token',
            reset_password_attempts: 0
          }, {
            where: { id: user.id }
          })
          .resolves(user);

        supertest(app)
          .post('/api/auth/reset_password')
          .send({ email: user.email })
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(500);
              done();
            }
          });
      });

      it('should return 404 if user not found', (done) => {
        sandbox
          .mock(User)
          .expects('findOne')
          .withExactArgs({
            where: { email: user.email }
          })
          .resolves(null);

        supertest(app)
          .post('/api/auth/reset_password')
          .send({ email: user.email })
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

    describe('PUT /api/auth/reset_password', () => {
      it('should update the password successfully', (done) => {
        const newUser = { ...user, isMaxPasswordResetAttemptReached: () => false };
        sandbox
          .mock(bcrypt)
          .expects('compareSync')
          .withExactArgs(helperRes.token, 'token')
          .once()
          .returns(true);
        sandbox
          .mock(bcrypt)
          .expects('hashSync')
          .withExactArgs('password', 12)
          .once()
          .returns('new_password');
        sandbox
          .mock(User)
          .expects('findOne')
          .withExactArgs({
            where: { email: user.email }
          })
          .resolves(newUser);
        sandbox
          .mock(User)
          .expects('update')
          .withExactArgs({
            password: 'new_password',
            reset_password_token: '',
            reset_password_attempts: 0,
            status: UserStatuses.ACTIVE
          }, {
            where: { id: user.id }
          })
          .resolves(newUser);

        supertest(app)
          .put('/api/auth/reset_password')
          .send({
            email: user.email,
            reset_token: helperRes.token,
            new_password: 'password'
          })
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              expect(res.body.success).to.equal(true);
              done();
            }
          });
      });

      it('should return 404 if user not found', (done) => {
        sandbox
          .mock(User)
          .expects('findOne')
          .withExactArgs({
            where: { email: user.email }
          })
          .resolves(null);

        supertest(app)
          .put('/api/auth/reset_password')
          .send({
            email: user.email,
            reset_token: helperRes.token,
            new_password: 'password'
          })
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(404);
              done();
            }
          });
      });

      it('should return error if reset_token is not found in db', (done) => {
        const newUser = { ...user, reset_password_token: '' };
        sandbox
          .mock(User)
          .expects('findOne')
          .withExactArgs({
            where: { email: user.email }
          })
          .resolves(newUser);

        supertest(app)
          .put('/api/auth/reset_password')
          .send({
            email: user.email,
            reset_token: helperRes.token,
            new_password: 'password'
          })
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              expect(res.body.error).to.equal(true);
              done();
            }
          });
      });

      it('should return error and suspend account if max attempts is reached', (done) => {
        const newUser = { ...user, isMaxPasswordResetAttemptReached: () => true };
        sandbox
          .mock(User)
          .expects('findOne')
          .withExactArgs({
            where: { email: user.email }
          })
          .resolves(newUser);
        sandbox
          .mock(User)
          .expects('update')
          .withExactArgs({
            status: UserStatuses.SUSPENDED
          }, {
            where: { id: user.id }
          })
          .resolves(newUser);

        supertest(app)
          .put('/api/auth/reset_password')
          .send({
            email: user.email,
            reset_token: helperRes.token,
            new_password: 'password'
          })
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              expect(res.body.error).to.equal(true);
              done();
            }
          });
      });

      it('should return error and increase invalid attempts in db if wrong reset token', (done) => {
        const newUser = {
          ...user,
          isMaxPasswordResetAttemptReached: () => false,
          reset_password_attempts: 0
        };
        sandbox
          .mock(bcrypt)
          .expects('compareSync')
          .withExactArgs(helperRes.token, user.reset_password_token)
          .once()
          .returns(false);
        sandbox
          .mock(User)
          .expects('findOne')
          .withExactArgs({
            where: { email: user.email }
          })
          .resolves(newUser);
        sandbox
          .mock(User)
          .expects('update')
          .withExactArgs({
            reset_password_attempts: 1
          }, {
            where: { id: user.id }
          })
          .resolves(newUser);

        supertest(app)
          .put('/api/auth/reset_password')
          .send({
            email: user.email,
            reset_token: helperRes.token,
            new_password: 'password'
          })
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              expect(res.body.error).to.equal(true);
              done();
            }
          });
      });

      it('should return 500 if error saving invalid attempts when reset_token is wrong', (done) => {
        const newUser = {
          ...user,
          isMaxPasswordResetAttemptReached: () => false,
          reset_password_attempts: 0
        };
        sandbox
          .mock(bcrypt)
          .expects('compareSync')
          .withExactArgs(helperRes.token, user.reset_password_token)
          .once()
          .returns(false);
        sandbox
          .mock(User)
          .expects('findOne')
          .withExactArgs({
            where: { email: user.email }
          })
          .resolves(newUser);
        sandbox
          .mock(User)
          .expects('update')
          .withExactArgs({
            reset_password_attempts: 1
          }, {
            where: { id: user.id }
          })
          .rejects(newUser);

        supertest(app)
          .put('/api/auth/reset_password')
          .send({
            email: user.email,
            reset_token: helperRes.token,
            new_password: 'password'
          })
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(500);
              done();
            }
          });
      });


      it('should return error and suspend account on 5 invalid attempts', (done) => {
        const newUser = {
          ...user,
          isMaxPasswordResetAttemptReached: () => true,
          reset_password_attempts: 4
        };
        sandbox
          .mock(bcrypt)
          .expects('compareSync')
          .withExactArgs(helperRes.token, user.reset_password_token)
          .once()
          .returns(false);
        sandbox
          .mock(User)
          .expects('findOne')
          .withExactArgs({
            where: { email: user.email }
          })
          .resolves(newUser);
        sandbox
          .mock(User)
          .expects('update')
          .withExactArgs({
            reset_password_attempts: 5,
            status: UserStatuses.SUSPENDED
          }, {
            where: { id: user.id }
          })
          .resolves(newUser);

        supertest(app)
          .put('/api/auth/reset_password')
          .send({
            email: user.email,
            reset_token: helperRes.token,
            new_password: 'password'
          })
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              expect(res.body.error).to.equal(true);
              done();
            }
          });
      });
    });
  });
});
