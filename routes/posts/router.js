const path = require('path');

const express = require('express');

const router = express.Router();
const validator = require('express-validator');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../files')),
  filename(req, file, cb) {
    const ext = file.originalname.split('.').pop();
    cb(null, `file.${Date.now()}.${ext}`);
  },
});

const upload = multer({
  storage,
});

const { Posts, Users } = require('../../models');
const { checkToken } = require('../../utils/checkToken');
const { control, reject } = require('../../utils/control');

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
  return result;
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
    ],
  });
  return post || reject(404);
}));

router.post('/:id/file', [
  validator.param('id').isInt({ min: 1 }),
], checkToken, upload.single('file'), control(async ({ req }) => {
  const { user } = req;
  const { file } = req.file;
  if (!user) return reject(401);
  if (!file) return reject(400);
  return file;
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
    ],
  });
  return post || reject(404);
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
