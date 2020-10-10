require('dotenv').config();

const http = require('http');
const app = require('./app');

http.createServer(app).listen(8000, err => {
  if (err) {
    console.err(err);
    process.exit(1);
  }
});
