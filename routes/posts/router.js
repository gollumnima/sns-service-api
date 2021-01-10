const express = require('express');
const lodash = require('lodash');
const fp = require('lodash/fp');
const { Op } = require('sequelize');

const router = express.Router();
const validator = require('express-validator');
const Upload = require('../../utils/upload');

const {
  Posts, Users, Images, Likes, sequelize, Comments,
} = require('../../models');
const { checkToken, guardUser } = require('../../utils/checkToken');
const { control, reject } = require('../../utils/control');

const sanitizeObj = (keys = []) => fp.pipe(
  fp.pick(keys),
  fp.pickBy(v => v !== undefined),
);

const upload = Upload((req, filename, ext) => (
  `${encodeURIComponent(filename)}.${Date.now()}.${ext}`
));

router.get('/', [
  validator.query('limit').optional().isInt({ min: 0, max: 100 }).toInt(),
  validator.query('offset').optional().isInt({ min: 0 }).toInt(),
  validator.query('user_id').optional().isInt({ min: 0 }).toInt(),
], control(async ({ req }) => {
  const { limit = 20, offset = 0, user_id } = req.query;
  console.log({ limit, offset });

  const condition = {
    deleted_at: null,
    status: 'PUBLISHED',
    user_id: user_id || undefined,
  };

  const where = sanitizeObj([
    'deleted_at',
    'status',
    'user_id',
  ]);

  const { rows, count } = await Posts.findAndCountAll({
    where: where(condition),
    limit,
    offset,
    order: [['id', 'DESC']],
    include: [{
      model: Users,
      attributes: ['id', 'username'],
    }, {
      model: Images,
      attributes: ['id', 'url'],
    }, {
      model: Likes,
      attributes: ['id', 'user_id'],
      where: {
        deleted_at: null,
      },
      required: false,
      include: [{
        model: Users,
        attributes: ['id', 'username'],
      }],
    }, {
      model: Comments,
      where: {
        deleted_at: null,
      },
      required: false,
      include: [{
        model: Users,
        attributes: ['id', 'username'],
      }],
    }],
  });
  return { rows, count };
}));

router.post('/', checkToken, guardUser, control(async ({ req }) => {
  const { user } = req;
  const result = await Posts.create({
    user_id: user.id,
    status: 'DRAFT',
  });
  return result.dataValues;
}));

router.get('/:id', [
  validator.param('id').isInt({ min: 1 }).toInt(),
  checkToken,
], control(async ({ req }) => {
  const { user } = req;
  const { id } = req.params;
  const post = await Posts.findOne({
    where: {
      id,
      deleted_at: null,
      [Op.or]: [
        { status: 'PUBLISHED' },
        { user_id: user ? user.id : null },
      ],
    },
    include: [{
      model: Users,
      attributes: ['id', 'username'],
    }, {
      model: Images,
      attributes: ['id', 'url'],
    }, {
      model: Likes,
      attributes: ['id', 'user_id'],
      where: {
        deleted_at: null,
      },
      required: false,
      include: [{
        model: Users,
        attributes: ['id', 'username'],
      }],
    }, {
      model: Comments,
      where: {
        deleted_at: null,
      },
      required: false,
      include: [{
        model: Users,
        attributes: ['id', 'username'],
      }],
    }],
  });

  const brothers = await sequelize.query(`
    SELECT
      (SELECT MIN(id) FROM posts WHERE id > ${Number(id)} AND status = 'PUBLISHED') AS next_id,
      (SELECT MAX(id) FROM posts WHERE id < ${Number(id)} AND status = 'PUBLISHED') AS prev_id
  `);
  const { next_id, prev_id } = lodash.get(brothers, '[0][0]', {});
  return post
    ? { ...post.dataValues, next_id, prev_id }
    : reject(404);
}));

// 수정 메소드
router.put('/:id', [
  validator.param('id').isInt({ min: 1 }).toInt(),
  validator.body('status').isIn(['HIDDEN', 'PUBLISHED', 'DELETED']),
], checkToken, guardUser, control(async ({ req }) => {
  const { id } = req.params;
  const { user } = req;

  const data = sanitizeObj([
    'content',
    'status',
  ])(req.body);

  const [result] = await Posts.update(data, {
    where: {
      id,
      user_id: user.id,
    },
  });

  return result || reject(404);
}));

// 삭제 메소드
router.delete('/:id', [
  validator.param('id').isInt({ min: 1 }).toInt(),
], checkToken, guardUser, control(async ({ req }) => {
  const { id } = req.params;
  const { user } = req;
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

router.post('/:postId/image', [
  validator.param('postId').isInt({ min: 1 }).toInt(),
], checkToken, guardUser, upload('file'), control(async ({ req }) => {
  const { user, file } = req;
  const { postId } = req.params;
  if (!file) return reject(400, '이미지를 첨부하세요');

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

router.post('/:postId/like', [
  validator.param('postId').isInt({ min: 1 }).toInt(),
], checkToken, guardUser, control(async ({ req }) => {
  const { user } = req;
  const { postId } = req.params;
  const prevLike = await Likes.findOne({
    where: {
      post_id: postId,
      user_id: user.id,
      deleted_at: null,
    },
  });

  if (prevLike) return prevLike.dataValues;

  const nextLike = await Likes.create({
    post_id: postId,
    user_id: user.id,
  });

  return nextLike;
}));

router.delete('/:postId/like', [
  validator.param('postId').isInt({ min: 1 }).toInt(),
], checkToken, guardUser, control(async ({ req }) => {
  const { user } = req;
  const { postId } = req.params;

  const [result] = await Likes.update({
    deleted_at: Date.now(),
  }, {
    where: {
      post_id: postId,
      user_id: user.id,
    },
  });

  return result || reject(404);
}));

module.exports = router;
