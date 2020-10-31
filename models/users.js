const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Users = sequelize.define(
  'Users', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    display_name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: '',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      onUpdate: DataTypes.NOW,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('PUBLIC', 'PRIVATE'),
      allowNull: false,
      defaultValue: 'PUBLIC',
    },
  }, { tableName: 'users', underscored: true, timestamps: false },

);

module.exports = Users;
