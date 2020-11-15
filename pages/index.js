const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  const name = 'dobby';
  res.send(`
  <html>
    <body>
      바보 ${name}
    </body>
  </html>
  `);
});

module.exports = router;
