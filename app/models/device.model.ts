import sequelize from '../../config/sequelize';
import * as Sequelize from 'sequelize';

const Device = sequelize.define('tb_client_devices', {
  UUID: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  user_id: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  client_id: {
    type: Sequelize.STRING(255),
    allowNull: false
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Device;
