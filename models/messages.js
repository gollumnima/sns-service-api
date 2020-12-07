const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Messages = sequelize.define('Messages', {
  sender: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  receiver: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, { tableName: 'messages', underscored: true, timestamps: false });

module.exports = Messages;
