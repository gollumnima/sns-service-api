const jwt = require('jsonwebtoken');
const Users = require('../models/users');
const { HttpError } = require('./reject');

const { AUTH_TOKEN_SECRET } = process.env;

const checkToken = async (req, res, next) => {
  try {
    if (!req.headers.authorization) return next();
    const [shouldBeBearer, token] = req.headers.authorization.split(' ');
    if (!token) return next();
    const { id } = jwt.verify(token, AUTH_TOKEN_SECRET);
    const foundUser = await Users.findOne({
      where: {
        id,
        deleted_at: null,
      },
    });
    req.user = foundUser;
    next();
  } catch (err) {
    req.user = null;
    next();
  }
};

const guardUser = (req, res, next) => (
  req.user ? next() : next(new HttpError(401, 'Unauthenticate'))
);

module.exports = {
  checkToken,
  guardUser,
};
