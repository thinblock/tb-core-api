import sequelize from '../../config/sequelize';
import * as Sequelize from 'sequelize';

const ActivityLog = sequelize.define('tb_activity_logs', {
  log: {
    type: Sequelize.TEXT,
    allowNull: false
  }, // Message like: user 209 creatd successfully!
  data: Sequelize.JSON, // Data in stringified JSON format if any
  event_type: Sequelize.STRING(255),
  client_id: {
    type: Sequelize.STRING(255),
    allowNull: false,
  }, // Hashed secret
  user_id: Sequelize.STRING(255),
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default ActivityLog;