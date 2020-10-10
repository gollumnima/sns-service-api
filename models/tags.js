const { DataTypes } = require('sequelize');
const sequlize = require('../db');

const Tags = sequlize.define(
  'Tags', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },

  },
);

module.exports = Tags;
