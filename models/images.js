const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Images = sequelize.define(
  'Images', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    post_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING(2000),
      allowNull: false,
    },
  }, { tableName: 'images', underscored: true, timestamps: false },

);

module.exports = Images;
