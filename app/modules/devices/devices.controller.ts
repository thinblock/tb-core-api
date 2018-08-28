import * as restify from 'restify';
import { InternalServerError, NotFoundError } from 'restify-errors';
import IController from '../../interfaces/utils/IController';
import { IRequest, IResponse } from '../../interfaces/utils/IServer';
import Device from '../../models/device.model';
import to from 'await-to-js';
import { IDevice } from '../../interfaces/models';

export default class DevicesController implements IController {
  public async post(req: IRequest, res: IResponse, next: restify.Next) {
    try {
      const deviceObj = req.body;
      const device = <IDevice> await Device.create({
        ...deviceObj,
        client_id: req.client_id
      });

      return res.send(device);
    } catch (e) {
      req.log.error(e);
      throw new InternalServerError(e);
    }
    return next();
  }

  public async delete(req: IRequest, res: IResponse, next: restify.Next) {
    try {
      const device = await Device.destroy({
        where: {
          id: req.params.device_id,
          client_id: req.client_id,
          user_id: req.query.user_id
        },
      });

      if (!device) {
        return res.send(new restify.NotFoundError('Device not found for given id'));
      }

      return res.send({ success: true, message: 'Device deleted successfully' });
    } catch (e) {
      req.log.error(e);
      throw new InternalServerError(e);
    }
    return next();
  }

  public async get(req: IRequest, res: IResponse, next: restify.Next) {
    try {
      const device = <IDevice> await Device.findOne({
        where: {
          id: req.params.device_id,
          client_id: req.client_id,
          user_id: req.query.user_id
        },
      });

      if (!device) {
        return res.send(new restify.NotFoundError('Device not found for given id'));
      }

      return res.send(device);
    } catch (e) {
      req.log.error(e);
      throw new InternalServerError(e);
    }
    return next();
  }

  public async getAll(req: IRequest, res: IResponse, next: restify.Next) {
    try {
      const devices = <IDevice[]> await Device.findAll({
        where: { client_id: req.client_id, user_id: req.query.user_id }
      });

      return res.send({ result: devices, total_results: devices.length });
    } catch (e) {
      req.log.error(e);
      throw new InternalServerError(e);
    }
    return next();
  }
}
