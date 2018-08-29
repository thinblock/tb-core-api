import sequelize from '../../config/sequelize';
import * as Sequelize from 'sequelize';

const PhoneVerificationCode = sequelize.define('tb_phone_verification_codes', {
  attempts: Sequelize.INTEGER(11),
  otp: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  user_id: {
    type: Sequelize.INTEGER(),
    allowNull: false,
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default PhoneVerificationCode;