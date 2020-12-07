const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Comments = sequelize.define('Comments', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('POSTED', 'DELETED'),
    allowNull: false,
    defaultValue: 'POSTED',
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
}, { tableName: 'comments', underscored: true, timestamps: false });

module.exports = Comments;
