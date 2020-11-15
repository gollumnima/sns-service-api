const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Files = sequelize.define(
  'files', {
    // id는 원래 자동으로 만들어줌! 안써줘도 되긴 함
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
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
      onUpdate: DataTypes.NOW,
      allowNull: false,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  { tableName: 'files', underscored: true, timestamps: false },
);

module.exports = Files;
