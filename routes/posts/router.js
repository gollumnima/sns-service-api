const express = require('express');

const router = express.Router();
const validator = require('express-validator');
const Upload = require('../../utils/upload');

const { Posts, Users, Images } = require('../../models');
const { checkToken } = require('../../utils/checkToken');
const { control, reject } = require('../../utils/control');

const upload = Upload((req, filename, ext) => (
  `${encodeURIComponent(filename)}.${Date.now()}.${ext}`
));

router.get('/', [
  validator.query('limit').isInt({ min: 0, max: 100 }),
  validator.query('offset').isInt({ min: 0 }),
], control(async ({ req }) => {
  const { limit = 20, offset = 0 } = req.query;
  const { rows, count } = await Posts.findAndCountAll({
    where: {
      deleted_at: null,
    },
    limit,
    offset,
    include: [{
      model: Users,
      attributes: {
        exclude: ['password'],
      },
    }, {
      model: Images,
    }],
  });
  return { rows, count };
}));

router.post('/', [

], checkToken, control(async ({ req }) => {
  const { user } = req;
  const { content = '' } = req.body;
  if (!user) return reject(401);
  const result = await Posts.create({
    content,
    user_id: user.id,
  });
  return result.dataValues;
}));

router.get('/:id', [
  validator.param('id').isInt({ min: 1 }),
], control(async ({ req }) => {
  const { id } = req.params;
  const post = await Posts.findOne({
    where: { id },
    include: [
      {
        model: Users,
        attributes: {
          exclude: ['password'],
        },
      },
      {
        model: Images,
      },
    ],
  });
  return post || reject(404);
}));

router.post('/:postId/file', [
  validator.param('postId').isInt({ min: 1 }),
], checkToken, upload('file'), control(async ({ req }) => {
  const { user, file } = req;
  const { postId } = req.params;
  if (!user) return reject(401);
  if (!file) return reject(400);

  const post = await Posts.findOne({
    where: { id: postId, user_id: user.id },
  });
  if (!post) return reject(404);

  const image = await Images.create({
    post_id: postId,
    url: file.url,
    filename: file.originalname,
    type: file.mimetype,
  });

  return image.dataValues;
}));

// 수정 메소드
router.put('/:id', [
  validator.param('id').isInt({ min: 1 }),
], checkToken, control(async ({ req }) => {
  const { id } = req.params;
  const { user } = req;
  const { content } = req.body;

  if (!user) return reject(401);
  const [result] = await Posts.update({
    content,
  }, {
    where: {
      id,
      user_id: user.id,
    },
  });

  return result || reject(404);
}));

// 삭제 메소드
router.delete('/:id', [
  validator.param('id').isInt({ min: 1 }),
], checkToken, control(async ({ req }) => {
  const { id } = req.params;
  const { user } = req;
  if (!user) return reject(401);
  const [result] = await Posts.update({
    status: 'DELETED',
    deleted_at: Date.now(),
  }, {
    where: {
      id,
      user_id: user.id,
    },
  });
  return result || reject(404);
}));

module.exports = router;
