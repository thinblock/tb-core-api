import * as path from 'path';

interface ConfigSettings {
  root: string;
  name: string;
  port: number;
  env: string;
  debug: boolean;
  jwtSecret: string;
}

const env: string = process.env.NODE_ENV || 'development';
const debug: boolean = !!process.env.DEBUG || false;

// default settings are for dev environment
const config: ConfigSettings = {
  name: 'TB-CORE-API',
  env: env,
  debug: debug,
  root: path.join(__dirname, '/..'),
  port: 8080,
  jwtSecret: process.env.TB_JWT_SECRET || 'asdfsal;dfhasl;fhasflkshdf'
};

// settings for test environment
if (env === 'production') {
  config.port = 5005;
  config.debug = false;
}

export { config };
