const express = require('express');
const bcrypt = require('bcrypt');
// const jwt = require('json');
const fp = require('lodash/fp');
const validator = require('express-validator');
const jwt = require('jsonwebtoken');
const Upload = require('../../utils/upload');
const { Users, Images } = require('../../models');

const userServices = require('./services');
const followServices = require('./followServices');
const { checkToken, guardUser } = require('../../utils/checkToken');
const { control, reject } = require('../../utils/control');

const router = express.Router();

const { AUTH_TOKEN_SECRET } = process.env;

const upload = Upload((req, filename, ext) => (
  `u.${req.user.id}.${Date.now()}.${ext}`
));

router.get('/', checkToken, control(async ({ req }) => {
  const {
    limit = 20, offset = 0, find_by, find_value,
  } = req.query;

  const { rows, count } = await Users.findAndCountAll({
    where: {
    },
    limit,
    offset,
  });
  return { rows, count };
}));

// 회원가입
router.post('/', [
  validator.body('username').isLength({ min: 4, max: 20 }),
  validator.body('name').isLength({ min: 1, max: 40 }),
  validator.body('password').isLength({ min: 4 }),
], control(async ({ req }) => {
  const { username, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await Users.create({
    username,
    name,
    password: hashedPassword,
  });
  const { password: _, ...user } = result.dataValues;
  return user;
}));

router.post('/login', [
  validator.body('username').isLength({ min: 4 }),
  validator.body('password').isLength({ min: 4 }),
], control(async ({ req }) => {
  const { username, password: requestedPassword } = req.body;
  const findResult = await Users.findOne({
    where: { username },
  });
  if (!findResult) return reject(401);
  const { password: hashedPassword, ...user } = findResult.dataValues;
  const flag = await bcrypt.compare(requestedPassword, hashedPassword);
  if (!flag) return reject(401);
  const token = await jwt.sign({ id: user.id }, AUTH_TOKEN_SECRET, {
    expiresIn: '1d',
  });

  return { user, token };
  // user까지 불러주면 비용면에서 더 합리적일 수 있음.
}));

router.get('/username/:username', [

], control(async ({ req }) => {
  const { username } = req.params;
  const user = await userServices.findUserByUserName(username);
  return user.dataValues;
}));

router.get('/self', checkToken, guardUser, control(async ({ req }) => {
  const { user } = req;
  const foundUser = await Users.findOne({
    where: {
      id: user.id,
      deleted_at: null,
    },
    attributes: {
      exclude: ['password'],
    },
  });
  return foundUser || reject(404);
}));

router.post('/self/persona', checkToken, guardUser, upload('file'), control(async ({ req }) => {
  const { user, file } = req;
  if (!file) return reject(400);

  await Users.update({
    image_url: req.file.url,
  }, {
    where: {
      id: user.id,
    },
  });

  return {};
}));

router.delete('/self/persona', checkToken, guardUser, control(async ({ req }) => {
  const { user } = req;
  await Users.update({
    image_url: null,
  }, {
    where: {
      id: user.id,
    },
  });

  return {};
}));

// 수정
router.put('/self', [
  validator.body('username').isLength({ min: 4, max: 20 }),
  validator.body('name').isLength({ min: 1, max: 40 }),
  validator.body('password').isLength({ min: 4 }),
], checkToken, guardUser, control(async ({ req }) => {
  const { username, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await Users.create({
    username,
    name,
    password: hashedPassword,
  });
  const { password: _, ...user } = result.dataValues;
  return user;
}));

router.get('/:id', [
  validator.param('id').isInt({ min: 1 }),
], control(async ({ req }) => {
  const { id } = req.params;
  const foundUser = await Users.findOne({
    where: {
      id,
      deleted_at: null,
    },
    attributes: {
      exclude: ['password'],
    },
  });
  return foundUser || reject(404);
}));

router.get('/:userId/followers', [
  validator.param('userId').isInt({ min: 1 }),
  validator.query('limit').optional().isInt({ min: 0, max: 100 }).toInt(),
  validator.query('offset').optional().isInt({ min: 0 }).toInt(),
], control(async ({ req }) => {
  const { userId } = req.params;
  const { limit = 20, offset = 0 } = req.query;
  const { rows, count } = await followServices.findFollowersOfUser(userId, { limit, offset });
  return { rows, count };
}));

router.get('/:userId/followings', [
  validator.param('userId').isInt({ min: 1 }),
  validator.query('limit').optional().isInt({ min: 0, max: 100 }).toInt(),
  validator.query('offset').optional().isInt({ min: 0 }).toInt(),
], control(async ({ req }) => {
  const { userId } = req.params;
  const { limit = 20, offset = 0 } = req.query;
  const { rows, count } = await followServices.findFollowingsOfUser(userId, { limit, offset });
  return { rows, count };
}));

router.post('/:userId/followers', [
  validator.param('userId').isInt({ min: 1 }),
  checkToken,
  guardUser,
], control(async ({ req }) => {
  const { user } = req;
  const { userId } = req.params;
  const result = await followServices.followUser(user.id, userId);
  return result;
}));

router.delete('/:userId/followers', [
  validator.param('userId').isInt({ min: 1 }),
  checkToken,
  guardUser,
], control(async ({ req }) => {
  const { user } = req;
  const { userId } = req.params;
  const result = await followServices.unfollowUser(user.id, userId);
  return result;
}));

module.exports = router;
