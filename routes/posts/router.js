const path = require('path');
const fs = require('fs');

const lodash = require('lodash');
const express = require('express');

const router = express.Router();
const validator = require('express-validator');
const multer = require('multer');

const fileDir = path.join(__dirname, '../../static');

if (!fs.existsSync(fileDir)) {
  fs.mkdirSync(fileDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, fileDir),
  filename(req, file, cb) {
    const words = file.originalname.split('.');
    const filename = words.slice(0, -1).join('');
    const ext = words.slice(-1).join('');
    cb(null, `${encodeURIComponent(filename)}.${Date.now()}.${ext}`);
  },
});

const upload = multer({ storage });

const { Posts, Users, Images } = require('../../models');
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

router.post('/:post_id/file', [
  validator.param('post_id').isInt({ min: 1 }),
], checkToken, upload.single('file'), control(async ({ req }) => {
  const { user, file } = req;
  const { post_id } = req.params;
  if (!user) return reject(401);
  if (!file) return reject(400);

  const post = await Posts.findOne({
    where: { id: post_id, user_id: user.id },
  });
  if (!post) return reject(404);

  const url = file.path.replace(fileDir, '');

  const image = await Images.create({
    post_id,
    url,
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
