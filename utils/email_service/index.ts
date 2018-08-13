import * as nodemailer from 'nodemailer';
import { EmailTypes } from '../../app/interfaces/enums';
import { retry } from 'async';
import { createTransport } from 'nodemailer';
import * as Email from 'email-templates';
import { email as emailConfig, config } from '../../config/env';
import { logger } from '../logger';

const transport = createTransport({
  host: emailConfig.host,
  secure: true,
  logger: config.debug,
  debug: config.debug,
  auth: {
    user: emailConfig.user,
    pass: emailConfig.password
  }
});

/**
 * @param  {String} email - Email of the recepient
 * @param  {String} name - Name of the recepient
 * @param  {String} type - Type of the email template, we've above mentioned valid templates
 * @param  {Object} data - Data object to send to email template
 * @return {Promise} promise;
 */
function sendEmail(email: string, name: string, type: EmailTypes, data: any): Promise<any> {
  if (!email) {
    throw new Error('Email is required');
  }

  if (!name) {
    throw new Error('Name is required');
  }

  const emailer = new Email({
    message: {
      from: 'ThinBlock <no-reply@thinblock.io>'
    },
    send: true,
    transport
  });

  const sendEmailWrapper = (cb: (e: Error, res: any) => any) => {
    emailer.send({
      message: {
        to: email
      },
      template: type,
      locals: data
    })
    .then((res: any) => cb(null, res))
    .catch(cb);
  };

  const promise = new Promise((resolve, reject) => {
    // retry 3 times with 100ms, 200ms, 300ms delay
    // If test env, don't activate interval delay
    retry({
      times: 3,
      interval: config.test ? 1 : (retryCount) => (50 * Math.pow(2, retryCount))
    }, sendEmailWrapper, function(err, result) {
      if (err) {
        logger.error(err);
        return reject(err);
      }
      return resolve(result);
    });
  });

  return promise;
}

export {
  sendEmail
};