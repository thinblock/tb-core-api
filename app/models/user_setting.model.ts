import sequelize from '../../config/sequelize';
import * as Sequelize from 'sequelize';

const UserSetting = sequelize.define('tb_auth_user_settings', {
  enable_otp: Sequelize.BOOLEAN,
  phone: Sequelize.STRING(255),
  attempts: Sequelize.INTEGER(11),
  user_id: {
    type: Sequelize.INTEGER(11),
    references: {
      model: 'tb_auth_users',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default UserSetting;