const express = require('express');

const router = express.Router();
const users = require('./users/router');
const posts = require('./posts/router');
const comments = require('./comments/router');

router.use('/users', users);
router.use('/posts', posts);
router.use('/comments', comments);

module.exports = router;
