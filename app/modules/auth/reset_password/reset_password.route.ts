import ResetPasswordController from './reset_password.controller';
import * as Joi from 'joi';
import { IRoute, IRouteConfig, HttpMethods, AuthStrategies } from '../../../interfaces/utils/Route';
import { oneLine } from 'common-tags';

class ResetPasswordRoute implements IRoute {
  public basePath = '/api/auth/reset_password';
  public controller = new ResetPasswordController();
  public swaggerTag = 'Authentication';

  public getServerRoutes(): IRouteConfig[] {
    return [
      {
        method: HttpMethods.POST,
        auth: AuthStrategies.PUBLIC,
        handler: this.controller.post,
        validation: {
          schema: {
            body: Joi.object().keys({
              email: Joi.string().email().required(),
            }).required(),
          }
        },
        swagger: {
          summary: 'Send Password Reset Email',
          description: oneLine`
            Sends password reset email to the given email with reset_token.
            Returns 404 error if user not found.
          `,
          responses: [
            {
              code: 404,
              data: {
                success: true,
                message: `User doesn't exist in our db`
              }
            },
            {
              code: 200,
              data: {
                success: true,
                message: oneLine`
                  Password reset email is successfully sent. Please check your email and follow
                  the instructions to reset your password.
                `
              }
            }
          ]
        },
      },
      {
        method: HttpMethods.PUT,
        auth: AuthStrategies.PUBLIC,
        handler: this.controller.put,
        validation: {
          schema: {
            body: Joi.object().keys({
              email: Joi.string().email().required(),
              reset_token: Joi.string().required(),
              new_password: Joi.string().min(6).required(),
            }).required()
          }
        },
        swagger: {
          summary: 'Confirm Password Reset Token',
          description: oneLine`
            Saves new password when correct reset_token is provided. Returns error if
            reset_token is invalid. Hitting this endpoint 5 times with invalid token
            suspends the user's account. You need to create a new reset_token to start
            over.
          `,
          responses: [
            {
              code: 404,
              data: {
                success: true,
                message: `User doesn't exist in our db`
              }
            },
            {
              code: 200,
              data: {
                success: true,
                message: 'Your Password has been reset successfully'
              }
            },
            {
              code: 200,
              data: {
                error: true,
                message: 'Given Password reset token is incorrect'
              }
            },
            {
              code: 200,
              data: {
                error: true,
                message: oneLine`
                  Your account has reached max invalid password reset attempts. Please try
                  requesting new password reset link again.
                `
              }
            },
            {
              code: 200,
              data: {
                error: true,
                message: oneLine`
                  This password reset token was either used or has expired. Please try
                  generating new password reset token and try again.
                `
              }
            }
          ]
        },
      }
    ];
  }
}

export default ResetPasswordRoute;
