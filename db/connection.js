const { Sequelize } = require('sequelize');

const {
  DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST,
} = process.env;

const sequelize = new Sequelize({
  dialect: 'mariadb',
  dialectOptions: {
    timezone: 'Asia/Seoul',
  },
  host: DB_HOST,
  database: DB_NAME,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  logging: false,
});

module.exports = sequelize;
