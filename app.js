const express = require('express');

const app = express();
const routes = require('./routes');

app.use(express.json());
app.use(routes);

app.disable('etag');

// app.get('/', (req, res) => {
//   res.status(200).send('이백오케');
// });

// app.get('/foo', (req, res) => {
//   res.status(200).send('이백오케');
// });

module.exports = app;
