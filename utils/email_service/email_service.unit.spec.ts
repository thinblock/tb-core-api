import * as chai from 'chai';
import * as supertest from 'supertest';
import * as sinon from 'sinon';
import * as Email from 'email-templates';
import { EmailTypes } from '../../app/interfaces/enums';
import { sendEmail } from './';
const expect = chai.expect;

describe('Unit Testing', () => {
  let sandbox: sinon.SinonSandbox = null;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Email Service', () => {
    const testEmail = 'test@test.com';
    const testName = 'testing';

    it('should send email successfully', async () => {
      sandbox
        .mock(Email.prototype)
        .expects('send')
        .withArgs({
          message: {
            to: testEmail
          },
          template: EmailTypes.RESET_PASSWORD,
          locals: {}
        })
        .once()
        .resolves({ success: true });

      const res = await sendEmail(testEmail, testName, EmailTypes.RESET_PASSWORD, {});

      expect(res).to.deep.equals({ success: true });
    });

    it('should throw error if email not specified', (done) => {
      expect(sendEmail.bind(sendEmail, '', testName, EmailTypes.RESET_PASSWORD, {}))
        .to
        .throw('Email is required');
      done();
    });

    it('should throw error if name not specified', (done) => {
      expect(sendEmail.bind(sendEmail, testEmail, '', EmailTypes.RESET_PASSWORD, {}))
        .to
        .throw('Name is required');
      done();
    });

    it('should call the function 3 times if it throws', async () => {
      sandbox
        .mock(Email.prototype)
        .expects('send')
        .withArgs({
          message: {
            to: testEmail
          },
          template: EmailTypes.RESET_PASSWORD,
          locals: {}
        })
        .atLeast(3)
        .rejects({ error: true });

      try {
        await sendEmail(testEmail, testName, EmailTypes.RESET_PASSWORD, {});
      } catch (err) {
        expect(err)
        .to
        .deep
        .equals({ error: true });
      }
    });

  });
});
