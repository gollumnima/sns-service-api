const jwt = require('jsonwebtoken');
const Users = require('../models/users');
const { HttpError } = require('./reject');

const { AUTH_TOKEN_SECRET } = process.env;

const checkToken = async (req, res, next) => {
  try {
    const [shouldBeBearer, token] = req.headers.authorization.split(' ');
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
    res.status(401).json({
      message: 'unauthenticate',
    });
  }
};

const guardUser = (req, res, next) => (
  req.user ? next() : next(new HttpError(401, 'Unauthenticate'))
);

module.exports = {
  checkToken,
  guardUser,
};
