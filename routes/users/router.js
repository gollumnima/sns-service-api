const express = require('express');
const bcrypt = require('bcrypt');
// const jwt = require('json');
const validator = require('express-validator');
const jwt = require('jsonwebtoken');
const { Users } = require('../../models');
const { checkToken } = require('../../utils/checkToken');
const { control, reject } = require('../../utils/control');

const router = express.Router();

const { AUTH_TOKEN_SECRET } = process.env;

router.get('/', checkToken, control(async ({ req }) => {
  const { limit, offset } = req.query;
  const { rows, count } = await Users.findAndCountAll({
    limit,
    offset,
  });
  return { rows, count };
}));

// 회원가입
router.post('/', [
  validator.body('username').isLength({ min: 4 }),
  validator.body('name').isLength({ min: 4 }),
  validator.body('password').isLength({ min: 4 }),
], control(async ({ req }) => {
  const { username, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await Users.create({
    username,
    name,
    password: hashedPassword,
  });
  return result;
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
    expiresIn: '1h',
  });

  return { user, token };
  // user까지 불러주면 비용면에서 더 합리적일 수 있음.
}));

router.get('/:id', [
  validator.param('id').isInt({ min: 1 }),
], checkToken, control(async ({ req }) => {
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
  if (!foundUser) return reject(404);
  return foundUser;
}));

module.exports = router;
