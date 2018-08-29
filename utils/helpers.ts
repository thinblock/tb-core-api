import { v1 } from 'node-uuid';
import { urls } from '../config/env';

const generatePasswordResetLink = (): {link: string, token: string} => {
  const token: string = v1();
  const link: string = urls.FRONTEND + '/reset-password?token=' + token;
  return { link, token };
};

const generateOTP = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export {
  generatePasswordResetLink,
  generateOTP
};
