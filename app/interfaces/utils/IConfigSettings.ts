interface EnvConfig {
  root: string;
  name: string;
  port: number;
  env: string;
  debug: boolean;
  test: boolean;
  jwtSecret: string;
  oAuthSecret: string;
  ethNode: string;
  apiary: {
    name: string;
    token: string;
  };
}

interface URLConfig {
  API: string;
  FRONTEND: string;
}

interface EmailConfig {
  host: string;
  user: string;
  password: string;
}

export {
  EnvConfig,
  URLConfig,
  EmailConfig
};