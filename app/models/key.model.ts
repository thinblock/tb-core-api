import sequelize from '../../config/sequelize';
import * as Sequelize from 'sequelize';

const Key = sequelize.define('tb_keys_keys', {
  client_id: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  user_id: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  encrypted_key: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Key;