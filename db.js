const { Sequelize } = require('sequelize');

const {
  DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST,
} = process.env;

const sequelize = new Sequelize({
  dialect: 'mariadb',
  dialectOptions: {
    timezone: 'Asia/Seoul',
  },
  // logging: false, // 해보지 말자.
  host: DB_HOST,
  database: DB_NAME,
  username: DB_USERNAME,
  password: DB_PASSWORD,
});

module.exports = sequelize;
