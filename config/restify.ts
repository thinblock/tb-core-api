import * as fs from 'fs';
import * as restify from 'restify';
import * as path from 'path';
import * as joiMiddleware from 'restify-joi-middleware';
import * as auth from '../app/middlewares/auth';
import { IRoute, AuthStrategies, HttpMethods } from '../app/interfaces/utils/Route';
import { config } from './env';
import { logger } from '../utils/logger';

// get path to route handlers
const pathToRoutes: string = path.join(config.root, '/app/routes');

// create Restify server with the configured name
const app: restify.Server = restify.createServer({ name: 'config.name' });

const buildServer = async () : Promise<restify.Server> => {
  // parse the body of the request into req.params
  app.use(restify.bodyParser());
  // Adds JOI middleware for validating the params
  app.use(joiMiddleware());

  // user-defined middleware
  app.use((req: any, res: any, next: any) => {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // disable caching so we'll always get the latest data
    res.setHeader('Cache-Control', 'no-cache');

    // log the request method and url
    logger.info(`${req.method} ${req.url}`);

    // log the request body
    logger.info(`Params: ${JSON.stringify(req.params)}`);

    return next();
  });

  let files: string[] = fs.readdirSync(pathToRoutes);
  // add route handlers
  files = files.filter((file: string) => path.extname(file) === '.js');
  for (const file of files) {
    try {
      const ServerRoute = (await import(path.join(pathToRoutes, file))).default;
      const servRoute: IRoute = new ServerRoute();
      const basePath = servRoute.basePath;
      const routes = servRoute.getServerRoutes();
      if (routes.length > 5) {
        throw new Error(`
          ${file}: A Route can have maximum of 5 routes per
          file e.g getAll, get, put, post, delete
        `);
      }
      routes.forEach((route) => {
        const argsArr = [];
        const options = {
          path: basePath,
          validate: route.validation
        };
        argsArr.push(options);

        switch (route.auth) {
        case AuthStrategies.JWT:
          argsArr.push(auth.jwtAuth);
          break;
        }

        argsArr.push(route.handler);
        let method = 'get';
        switch (route.method) {
        case HttpMethods.GET:
          app.put.apply(app, argsArr);
          break;
        case HttpMethods.POST:
          app.post.apply(app, argsArr);
          break;
        case HttpMethods.PUT:
          app.put.apply(app, argsArr);
          break;
        case HttpMethods.DELETE:
          app.del.apply(app, argsArr);
          break;
        }
      });
    } catch (e) {
      console.log(`Failed to load ${file}`, e);
    }
  }
  return app;
};



export { buildServer };
