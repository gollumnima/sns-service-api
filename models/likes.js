const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Likes = sequelize.define(
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
  }, { tableName: 'likes', underscored: true, timestamps: false },

);

module.exports = Likes;
