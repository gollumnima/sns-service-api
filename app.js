const express = require('express');
const logger = require('morgan');

const pages = require('./pages');

const csv = require('./utils/csv');

const app = express();
const routes = require('./routes');

app.use(express.json());
app.disable('etag');
app.use(logger('dev'));
app.use('/api', routes);

app.use(pages);

// app.get('/', (req, res) => {
//   res.status(200).send('이백오케');
// });

// app.get('/foo', (req, res) => {
//   res.status(200).send('이백오케');
// });

module.exports = app;
