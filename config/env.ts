import * as path from 'path';
import { EnvConfig, URLConfig, EmailConfig } from '../app/interfaces/utils/IConfigSettings';

const env: string = process.env.NODE_ENV || 'development';
const debug: boolean = !!process.env.DEBUG || false;
const isDev: boolean = env === 'development';
const isTestEnv: boolean = env === 'test';
// default settings are for dev environment
const config: EnvConfig = {
  name: 'TB-CORE-API',
  env: env,
  test: isTestEnv,
  debug: debug,
  root: path.join(__dirname, '/..'),
  port: 8080,
  jwtSecret: process.env.TB_JWT_SECRET || 'asdfsal;dfhasl;fhasflkshdf',
  oAuthSecret: process.env.TB_OAUTH_SECRET || 'asdfasfshdfklsahfsl',
  ethNode: process.env.TB_ETH_NODE,
  apiary: {
    token: process.env.TB_APIARY_TOKEN,
    name: 'thinblockdev'
  }
};

const urls: URLConfig = {
  API: isDev ? 'http://localhost:8080' : 'https://api.thinblock.io',
  FRONTEND: isDev ? 'http://dev.thinblock.io' : 'https://thinblock.io'
};

const email: EmailConfig = {
  host: process.env.TB_EMAIL_HOST,
  user: process.env.TB_EMAIL_USER,
  password: process.env.TB_EMAIL_PASSWORD,
};

// settings for test environment
if (env === 'production') {
  config.port = 5005;
  config.debug = false;
}

export { config, urls, email };
