import * as chai from 'chai';
import * as sinon from 'sinon';
import * as OTP from './otp';
import PhoneVerificationCode from '../../app/models/phone_verification_code.model';
import * as Twilio from 'twilio';
import { twilio } from '../../config/env';

const expect = chai.expect;

describe('Unit Testing', () => {
  let sandbox: sinon.SinonSandbox = null;
  let phoneVerificationCode = { id: 1, otp: '1234', user_id: 1234, attempts: 0 };
  let response = { success: true, otp: '1234' };
  let client = Twilio(twilio.sid, twilio.token);

  beforeEach((done) => {
    sandbox = sinon.createSandbox();
    done();
  });

  afterEach((done) => {
    sandbox.restore();
    done();
  });

  describe('One Time Password Service', () => {
    it('should create OTP successfully', async () => {
      sandbox
        .mock(OTP)
        .expects('createPhoneCode')
        .withArgs('123456', 1)
        .resolves({ success: true, otp: '1234' });
      sandbox
        .mock(PhoneVerificationCode)
        .expects('findOne')
        .withArgs({
          where: { user_id: undefined }
        })
        .resolves(phoneVerificationCode);
      sandbox
        .mock(PhoneVerificationCode)
        .expects('destroy')
        .withArgs({
          where: { id: undefined }
        })
        .resolves({});
      sandbox
        .mock(client.messages)
        .expects('create')
        .withArgs({
          body: 'To login, please input this code: ${otp}',
          to: '123456',
          from: twilio.number
        })
        .once()
        .resolves({ success: true });

      const res = await (OTP.createPhoneCode('123456', 1));
      expect(res).to.deep.equals(response);
    });

    it('should return error if error reading phone verification code', async() => {
      sandbox
        .mock(PhoneVerificationCode)
        .expects('findOne')
        .withArgs({
          where: { user_id: undefined }
        })
        .rejects(phoneVerificationCode);

      const res = await(OTP.createPhoneCode('123456', 1));
      expect(res).to.have.property('success');
      expect(res).to.have.property('error');
    });

    it('should return error if error creating phone verification code', async() => {
      sandbox
        .mock(PhoneVerificationCode)
        .expects('findOne')
        .withArgs({
          where: { user_id: undefined }
        })
        .resolves(phoneVerificationCode);
      sandbox
        .mock(PhoneVerificationCode)
        .expects('destroy')
        .withArgs({
          where: { id: undefined }
        })
        .resolves({});
      sandbox
        .mock(PhoneVerificationCode)
        .expects('create')
        .withArgs({
          user_id: undefined,
          otp: undefined,
          attempts: 0
        })
        .throws(null);

      const res = await(OTP.createPhoneCode('123456', 1));
      expect(res).to.have.property('success');
      expect(res).to.have.property('error');
    });

    it('should verify OTP successfully', async () => {
      sandbox
        .mock(OTP)
        .expects('verifyCode')
        .withArgs('1234', 1)
        .resolves({ success: true, message: 'Correct OTP entered' });
      sandbox
        .mock(PhoneVerificationCode)
        .expects('findOne')
        .withArgs({
          where: { user_id: undefined }
        })
        .resolves(phoneVerificationCode);
      const res = await (OTP.verifyCode('1234', 1));
      expect(res).to.deep.equals({ success: true, message: 'Correct OTP entered' });
    });

    it('should return OTP expiry message', async () => {
      sandbox
        .mock(OTP)
        .expects('verifyCode')
        .withArgs('1234', 1)
        .resolves({ success: false, message: 'Code has expired' });
      sandbox
        .mock(PhoneVerificationCode)
        .expects('findOne')
        .withArgs({
          where: { user_id: undefined }
        })
        .resolves(phoneVerificationCode);
      const res = await (OTP.verifyCode('1234', 1));
      expect(res).to.deep.equals({ success: false, message: 'Code has expired' });
    });

    it('should return inocrrect OTP message', async () => {
      sandbox
        .mock(PhoneVerificationCode)
        .expects('findOne')
        .withArgs({
          where: { user_id: undefined }
        })
        .resolves(phoneVerificationCode);
      sandbox
        .mock(PhoneVerificationCode)
        .expects('update')
        .withArgs({
          attempts: undefined,
          where: { id: undefined }
        })
        .resolves({
          ...phoneVerificationCode,
          attempts: phoneVerificationCode.attempts + 1
        });
      sandbox
        .mock(OTP)
        .expects('verifyCode')
        .withArgs('1234', 1)
        .resolves({ success: false, message: 'Wrong OTP entered' });
      const res = await (OTP.verifyCode('1234', 1));
      expect(res).to.deep.equals({ success: false, message: 'Wrong OTP entered' });
    });

    it('should return user blocked message', async () => {
      sandbox
        .mock(PhoneVerificationCode)
        .expects('findOne')
        .withArgs({
          where: { user_id: undefined }
        })
        .resolves(phoneVerificationCode);
      sandbox
        .mock(PhoneVerificationCode)
        .expects('update')
        .withArgs({
          attempts: undefined,
          where: { id: undefined }
        })
        .atLeast(3)
        .resolves({
          ...phoneVerificationCode,
          attempts: phoneVerificationCode.attempts + 1
        });
      sandbox
        .mock(OTP)
        .expects('verifyCode')
        .withArgs('1234', 1)
        .resolves({ success: false, message: 'Too many attempts - Blocking account' });
      const res = await (OTP.verifyCode('1234', 1));
      expect(res).to.deep.equals({
        success: false,
        message: 'Too many attempts - Blocking account'
      });
    });

    it('should return error if error reading phone verification code', async () => {
      sandbox
        .mock(PhoneVerificationCode)
        .expects('findOne')
        .withArgs({
          where: { user_id: undefined }
        })
        .rejects(phoneVerificationCode);

      const res = await(OTP.verifyCode('1234', 1));
      expect(res).to.have.property('success');
      expect(res).to.have.property('error');
    });
  });
});
