import * as restify from 'restify';
import ClassController from '../controllers/class.controller';
import { IRoute, IRouteConfig, HttpMethods, AuthStrategies } from '../interfaces/utils/Route';

class ClassRoute implements IRoute {
  public basePath = '/api/locations';
  public controller = new ClassController();

  public getServerRoutes(): IRouteConfig[] {
    return [
      {
        method: HttpMethods.GET,
        auth: AuthStrategies.JWT,
        handler: this.controller.getAll,
      }
    ];
  }
}

export default ClassRoute;
