import { IPhoneVerification } from '../../app/interfaces/models';
import PhoneVerificationCode from '../../app/models/phone_verification_code.model';
import { generateOTP } from '../helpers';
import { twilio, env } from '../../config/env';
import * as Twilio from 'twilio';
import { InternalServerError, NotFoundError } from 'restify-errors';
import to from 'await-to-js';

const createPhoneCode = async (phone: string, user_id: number) => {
  try {
    const accountSid = twilio.sid;
    const authToken = twilio.token;
    const fromPhoneNumber = twilio.number;
    const otp = generateOTP();
    const record = <IPhoneVerification> await PhoneVerificationCode.findOne({
      where: { user_id }
    });

    if (record) {
      await PhoneVerificationCode.destroy(
        { where: { id: record.id } }
      );
    }

    await PhoneVerificationCode.create({
      user_id: user_id,
      otp: otp,
      attempts: 0
    });

    if (env !== 'production') {
      return { success: true, otp: otp };
    } else {
      const client = Twilio(accountSid, authToken);
      const [err, success] = await to (client.messages.create({
        body: 'To login, please input this code: ${otp}',
        to: phone,
        from: fromPhoneNumber
      }));

      if (err) {
        return { success: false, error: 'Could not send message' };
      } else {
        return { success: true, otp: otp };
      }
    }
  } catch (e) {
    return { success: false, error: e };
  }
};

// accept 'type', 'time diff', 'number of attempts' later
const verifyCode = async (code: string, user_id: number) => {
  try {
    // make type generic later
    const phoneVerification = <IPhoneVerification> await PhoneVerificationCode.findOne(
      { where: { user_id } });

    // check if record with given phone number exists
    if (!phoneVerification) {
      return { success: false, message: 'Phone number not found' };
    } else {
      const createdDate = new Date(phoneVerification.created_at).valueOf();
      const currentDate = Date.now();
      const diff = (currentDate - createdDate) / 1000;
      // check time difference (1 minute limit)
      // make time diff generic later
      if (diff > 60) {
        return { success: false, message: 'Code has expired' };
      } else {
        // check number of attempts
        if (phoneVerification.attempts === 3) {
          // disable account
          return { success: false, message: 'Too many attempts - Blocking account', blocked: true };
        } else {
          // check code provided with record present
          if (phoneVerification.otp === code) {
            // return success
            return { success: true, message: 'Correct OTP entered' };
          } else {
            // increment attempts and return error
            const attempts = phoneVerification.attempts + 1;
            await PhoneVerificationCode.update(
              { attempts: attempts },
              { where: { id: phoneVerification.id } }
            );
            return { success: false, message: 'Wrong OTP entered' };
          }
        }
      }
    }
  } catch (e) {
    return { success: false, error: e };
  }
};

export {
  createPhoneCode,
  verifyCode
};
