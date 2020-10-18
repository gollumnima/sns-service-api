// const jwt = require('jsonwebtoken');
const Users = require('../models/users');

const { AUTH_TOKEN_SECRET } = process.env;

const checkToken = async (req, res, next) => {
  const [shouldBeBearer, token] = req.headers.authorization.split(' ');
  const { id } = jwt.verify(token, AUTH_TOKEN_SECRET);
  const foundUser = await Users.findOne({
    where: {
      id,
      deleted_at: null,
    },
  });
  return foundUser;
};

module.exports = {
  checkToken,
};
