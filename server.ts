import mongoose = require('mongoose');
import { config } from './config/env';
import { app } from './config/restify';
import { logger } from './utils/logger';
import './config/sequelize';

app.listen(config.port, () => {
  logger.info(`${config.name} is running at ${app.url}`);
});

export { app };
