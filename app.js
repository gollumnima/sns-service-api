const path = require('path');
const express = require('express');

const app = express();
const routes = require('./routes');

const {
  NODE_ENV,
} = process.env;

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
