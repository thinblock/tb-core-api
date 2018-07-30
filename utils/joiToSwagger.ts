import { convert } from 'joi-route-to-swagger';
import { oneLine } from 'common-tags';
import * as yaml from 'write-yaml';
import * as Joi from 'joi';
import { IRouteConfig } from '../app/interfaces/utils/Route';
import { readFileSync } from 'fs';

const toSwaggerRoute = (routes: any[], basePath: string, tag: string, description: string) => {
  const convertedRoutes = [...routes].map((route: IRouteConfig) => {
    const { schema }: any = route.validation || {};
    const actionName = Date.now() + '_' + route.method;
    const actionNameFnHack = {
      [actionName]: () => ''
    };
    const routeObj = {
      method: route.method,
      path: route.param ? ('/:' + route.param) : '/',
      action: actionNameFnHack[actionName],
      summary: route.swagger.summary || '',
      description: route.swagger.description || '',
      responseExamples: route.swagger.responses,
      validators: Object.keys(schema || {}).reduce((valObj: any, key: string) => {
        valObj[key] = schema[key].isJoi ? schema[key] : Joi.object(schema[key]);
        return valObj;
      }, {})
    };
    return routeObj;
  });

  return ({
    basePath, tag, routes: convertedRoutes, description: description || ''
  });
};

const generateSwaggerYML = (swaggerRoutes: any[]) => {
  try {
    const options = {
      host: 'api.thinkblock.io',
      info: {
        title: `ThinBlock's API Documentation`,
        version: '0.1.0',
        description: oneLine`
          This documentation is a complete cookbook of ThinBlock's API. Everything is
          pretty well documented. If you have any questions please let us know.
        `
      }
    };
    const swaggerDoc = convert(removeRouteDuplicates(swaggerRoutes), options);
    yaml.sync('./swagger.yml', JSON.parse(JSON.stringify(swaggerDoc)));
    return readFileSync('./swagger.yml', { encoding: 'utf-8' });
  } catch (e) {
    console.log('Error while generating swagger doc: ', e);
    return false;
  }
};

const removeRouteDuplicates = (swaggerRoutes: any[]) => {
  const tags: any = {};
  const normalizeRoute = (routeModule: any) => {
    routeModule.routes = routeModule.routes.map((route: any) => {
      // Preventing from prepending the previous path again.
      if (route.path === '/' || route.path[1] === ':') {
        route.path = routeModule.basePath + route.path;
      }
      return route;
    });
    routeModule.basePath = '';
    return routeModule;
  };

  swaggerRoutes.forEach((routeModule: any) => {
    if (tags[routeModule.tag]) {
      let { routes } = tags[routeModule.tag];
      routes = routes.concat(routeModule.routes);
      tags[routeModule.tag] = normalizeRoute({ ...routeModule, routes });
    } else {
      tags[routeModule.tag] = normalizeRoute(routeModule);
    }
  });

  const uniqueRoutes: any[] = Object.keys(tags).reduce((ar: any[], tag: string) => {
    ar.push(tags[tag]);
    return ar;
  }, []);

  return uniqueRoutes;
};

export {
  toSwaggerRoute,
  generateSwaggerYML
};
