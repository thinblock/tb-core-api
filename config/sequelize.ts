
import * as Sequelize from 'sequelize';
import { logger } from '../utils/logger';

const db = process.env.TB_CORE_API_DB;

const sequelize = new Sequelize(db);

sequelize
 .authenticate()
  .then(() => {
    logger.info('DB Connected');
    sequelize.sync();
  })
  .catch(err => {
    logger.error('Unable to connect to the database:', err);
  });


export default sequelize;
