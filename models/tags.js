const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Tags = sequelize.define('Tags', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
}, { tableName: 'tags', underscored: true, timestamps: false });

module.exports = Tags;
