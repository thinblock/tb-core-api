import * as restify from 'restify';
import { IRequest, IResponse } from '../interfaces/utils/IServer';
import { IDevice } from '../interfaces/models';
import { UnauthorizedError, InternalServerError } from 'restify-errors';
import IMiddleware from '../interfaces/utils/IMiddleware';
import Device from '../models/device.model';

export default class AuthDeviceCheckMiddleware implements IMiddleware {
  public async init(req: IRequest, res: IResponse, next: restify.Next) {
    const devices = <IDevice[]> await Device.findAll({
      where: {
        client_id: req.client_id,
        user_id: req.body.user_id
      },
    });

    if (!devices || devices.length === 0) {
      return next();
    }

    const UUID: string = <string>(req.headers.UUID || req.headers.uuid);

    if (!UUID) {
      return next(new UnauthorizedError({
        message: 'No Device UUID was specified in the Request Headers'
      }));
    }

    if (devices.filter((device) => { return UUID === device.UUID; }).length === 0) {
      return next(new UnauthorizedError({
        message: 'Incorrect Device UUID was specified in the Request Headers'
      }));
    }

    return next();
  }
}