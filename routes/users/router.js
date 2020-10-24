const express = require('express');
const bcrypt = require('bcrypt');
// const jwt = require('json');
const jwt = require('jsonwebtoken');
const { Users } = require('../../models');
const { checkToken } = require('../../utils/checkToken');

// 이걸 왜 써놨을ㄹ까
// const router = require('../posts/router');
const router = express.Router();

const { AUTH_TOKEN_SECRET } = process.env;

router.get('/', checkToken, async (req, res) => {
  try {
    const users = await Users.findAll();

    console.log({ users });

    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
});

// 회원가입
// get method는 이력이 남기 때문에 Post로 가입해야 함
router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await Users.create({
      username,
      password: hashedPassword,
    });
    console.log({ result });
    res.status(200).json({ id: result.id });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password: requestedPassword } = req.body;
    const { dataValues: findResult } = await Users.findOne({
      where: { username },
    });

    if (!findResult) return res.status(401).json({});

    // 로그인하면ㅅ ㅓ내가 로그인한 패스워드를 주지 않으니까 암호만 비구조화 할당으로 따로 변수를 떼고 나머진 암호가 제거된 애들을 돌려주기

    const { password: hashedPassword, ...user } = findResult;
    const flag = await bcrypt.compare(requestedPassword, hashedPassword); // 해싱되기 전과 후의 암호

    // 해당 유저네임이 쓰는 암호와 맞지 않을때
    if (!flag) return res.status(401).json({});

    console.log(user);

    const token = await jwt.sign({ id: user.id }, AUTH_TOKEN_SECRET);

    res.status(200).json({
      token,
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.get('/:id', checkToken, (req, res) => {
  const [shouldBeBearer, token] = req.headers.authorization.split(' ');
  const tokenResult = jwt.verify(token, AUTH_TOKEN_SECRET);
  console.log({ shouldBeBearer, token, tokenResult });
  const { id } = res.params;
  res.status(200).json({
    foo: 'bar',
    id,
  });
});

module.exports = router;
