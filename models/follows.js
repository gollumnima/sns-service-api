const { DataTypes } = require('sequelize');
const sequlize = require('../db');

const Follows = sequlize.define(
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
);
module.exports = Follows;
