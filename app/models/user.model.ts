import sequelize from '../../config/sequelize';
import * as Sequelize from 'sequelize';
import { IModel } from '../interfaces/utils/Sequelize';
import UserSetting from './user_setting.model';

const User = <IModel> sequelize.define('tb_auth_users', {
  name: Sequelize.STRING(255),
  email: Sequelize.STRING(255),
  email_verified: Sequelize.BOOLEAN,
  auth_provider: Sequelize.STRING(15),
  login_attempt_time: Sequelize.DATE,
  login_attempt_success: Sequelize.BOOLEAN,
  login_attempts: Sequelize.INTEGER(11),
  password: Sequelize.STRING(255), // hashed password
  reset_password_token: Sequelize.STRING(255), // hashed token
  reset_password_attempts: Sequelize.INTEGER(11), // invalid attempts to reset password
  status: {
    // 5 Invalid attempts to reset password leads to account suspension for some time
    type: Sequelize.ENUM(['active', 'inactive', 'suspended', 'blocked']),
    defaultValue: 'active'
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

User.hasOne(UserSetting, { foreignKey: 'user_id', as: 'settings' });

User.prototype.isMaxPasswordResetAttemptReached = function(attempts: number): boolean {
  return attempts ? attempts >= 5 : this.reset_password_attempts >= 5;
};

export default User;