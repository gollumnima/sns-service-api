const { DataTypes } = require('sequelize');
const sequlize = require('../db');

const Images = sequlize.define(
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
  },
);

module.exports = Images;
