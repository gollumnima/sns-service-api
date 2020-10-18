const express = require('express');

const router = express.Router();

const { Posts, Users } = require('../../models');
const { checkToken } = require('../../utils/checkToken');

router.get('/', async (req, res) => {
  try {
    const { rows, count } = await Posts.findAndCountAll({
      where: {},
      include: [{
        model: Users,
        attributes: {
          exclude: ['password'],
        },
      }],
    });
    res.json({
      rows,
      count,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { user } = req;
    const { content } = req.body;
    const result = await Posts.create({
      content,
      user_id: user.id,
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {

});

router.put('/:id', async (req, res) => {

});
router.delete('/:id', async (req, res) => {
  try {

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
