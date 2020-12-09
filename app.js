const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();
const routes = require('./routes');

const {
  NODE_ENV,
} = process.env;

const whitelist = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://15.165.17.58',
];

app.use(cors({
  origin: (origin, cb) => {
    const result = whitelist.includes(origin);
    return result ? cb(null, true) : cb(new Error());
  },
  credentials: true,
}));

app.use(express.json());

if (NODE_ENV !== 'production') {
  app.disable('etag');
}

app.use(express.static(path.join(__dirname, './static')));
app.use('/api', routes);

// app.get('/', (req, res) => {
//   res.status(200).send('이백오케');
// });

// app.get('/foo', (req, res) => {
//   res.status(200).send('이백오케');
// });

module.exports = app;
