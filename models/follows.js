const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Follows = sequelize.define('Follows', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  follower_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  followee_id: {
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
{ tableName: 'follows', underscored: true, timestamps: false });

module.exports = Follows;
