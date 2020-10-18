require('dotenv').config();

const http = require('http');
const app = require('./app');

const sequelize = require('./db/connection');
const sync = require('./db/sync');
const models = require('./models');

http.createServer(app).listen(8000, err => {
  if (err) {
    console.err(err);
    process.exit(1);
  }
  // db.sync({ force: true });
  sync(sequelize, models);
});
