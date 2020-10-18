const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Follows = sequelize.define(
  'Follows', {
    follower: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    followee: {
      type: DataTypes.INTEGER.UNSIGNED,
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
  },
  { tableName: 'follows', underscored: true, timestamps: false },
);
module.exports = Follows;
