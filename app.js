const express = require('express');

const app = express();

app.disable('etag');

app.get('/', (req, res) => {
  res.status(200).send('이백오케');
});

app.get('/foo', (req, res) => {
  res.status(200).send('이백오케');
});

module.exports = app;
