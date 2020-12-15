const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Posts = sequelize.define('Posts', {
  // id는 원래 자동으로 만들어줌! 안써줘도 되긴 함
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '',
  },
  status: {
    type: DataTypes.ENUM('DRAFT', 'HIDDEN', 'PUBLISHED', 'DELETED'),
    allowNull: false,
    defaultValue: 'DRAFT',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  update_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
    allowNull: false,
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, { tableName: 'posts', underscored: true, timestamps: false });

module.exports = Posts;
