import * as bunyan from 'bunyan';
import { Request, Response } from 'restify';
import * as stream from 'stream';
import { retry } from 'async';
import { config } from '../config/env';
import { ActivityLogEvents } from '../app/interfaces/enums';

interface LoggerSettings {
  name: string;
  serializers: any;
  streams: Array<Object>;
}

const infoStream = new stream.Writable();
infoStream.writable = true;
infoStream.write = (info: any): boolean => {
  console.log(`====== ${JSON.parse(info).msg} =====`);
  return true;
};

let settings: LoggerSettings = {
  name: config.env,
  serializers: {
    req: (req: Request) => ({
      headers: req.headers,
      url: req.url,
      method: req.method
    }),
  },
  streams: [{ level: 'info', path: `api.log` }]
};

if (config.env === 'development') {
  settings.streams.push({ level: 'info', stream: infoStream });
}

if (config.debug) {
  settings.streams.push({ level: 'trace', stream: infoStream });
  settings.streams.push({ level: 'debug', path: 'debug.log' });
}

const logger = bunyan.createLogger(settings);
console.log(`Logger setting: ${settings.name}`);

const history = () => (req: Request, res: Response, next: any) => {
  // Lazy loading ActivityLog model, waits for its creation
  const ActivityLog = require('../app/models/activity_log.model').default;

  req = Object.assign(req, {
    activityLog: (c_id: string, log: string, type: ActivityLogEvents, u_id: string, data: any) => {
      if (config.env === 'test') return;
      try {
        retry(3, (cb) => {
          ActivityLog.create({
            user_id: u_id,
            log, event_type: type,
            client_id: c_id,
            data: JSON.stringify(data)
          })
          .then((res: any) => cb(null, res))
          .catch(cb);
        }, (err) => {
          if (err) {
            logger.error(`Failed to write activity logs to db: `, err);
          }
        });
      } catch (e) {
        logger.error(`Failed to write activity logs to db: `, e);
      }
    }
  });
  next();
};

export { logger, history };
