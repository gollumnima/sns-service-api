require('dotenv').config();

const http = require('http');
const app = require('./app');

const { PORT: port = 8000 } = process.env;

http.createServer(app).listen(port, err => {
  if (err) {
    console.err(err);
    process.exit(1);
  }
  console.log('SERVER START');
  console.log(`http://127.0.0.1:${port}`);
});
