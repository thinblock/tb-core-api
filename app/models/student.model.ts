import sequelize from '../../config/sequelize';
import * as Sequelize from 'sequelize';

const User = sequelize.define('tb_auth_user', {
  name: Sequelize.STRING(255),
  email: Sequelize.STRING(255),
  email_verified: Sequelize.BOOLEAN,
  auth_provider: Sequelize.STRING(15),
  password: Sequelize.STRING(255)
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default User;