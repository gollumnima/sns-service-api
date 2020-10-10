const { DataTypes } = require('sequelize');
const sequlize = require('../db');

const Likes = sequlize.define(
  'Likes', {
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
    is_active: {
      type: DataTypes.BOOLEAN,
      // TINYINT(1)과 같음
    },
  },
);

module.exports = Likes;
