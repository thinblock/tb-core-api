import sequelize from '../../config/sequelize';
import * as Sequelize from 'sequelize';

const Token = sequelize.define('tb_auth_tokens', {
  token_id: {
    type: Sequelize.STRING(255),
    unique: true
  },
  client_id: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  refresh_token: Sequelize.STRING(255),
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Token;