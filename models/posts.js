const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Posts = sequelize.define(
  'Posts', {
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
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    update_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  { tableName: 'posts', underscored: true, timestamps: false },
);

module.exports = Posts;