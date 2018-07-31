import * as apiary from 'apiaryio';
import { config } from './env';
import * as glob from 'glob-fs';
import { join } from 'path';
import { IRoute } from '../app/interfaces/utils/Route';
import { toSwaggerRoute, generateSwaggerYML } from '../utils/joiToSwagger';

const pathToRoutes: string = '**/**/*.route.ts';

const publishDocumentation = (docs: any) => {
  return new Promise((resolve, reject) => {
    apiary.publish(docs, config.apiary.name, config.apiary.token, resolve, reject);
  });
};

const generateDocumentation = async () => {
  let files: string[] = glob().readdirSync(pathToRoutes);
  const swaggerRoutes: any = [];

  try {
    for (const file of files) {
      const ServerRoute = (
        await import(join(config.root, file.replace('.ts', '.js')))
      ).default;
      const servRoute: IRoute = new ServerRoute();
      const basePath = servRoute.basePath;
      const routes = servRoute.getServerRoutes();
      swaggerRoutes.push(
        toSwaggerRoute(routes, basePath, servRoute.swaggerTag, servRoute.swaggerDescription)
      );
    }

    const apiDoc = generateSwaggerYML(swaggerRoutes);
    if (!apiDoc) {
      throw new Error('Error while generating doc');
    }
    await publishDocumentation(apiDoc);
    console.log('Successfully published API doc');
    process.exit(0);
  } catch (e) {
    console.log('Error while generating documentation', e.message);
    process.exit(1);
  }
};

generateDocumentation();
