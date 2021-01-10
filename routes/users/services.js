const { Users, Images, Follows } = require('../../models');
const { control, reject } = require('../../utils/control');

const findUserByUserName = async username => {
  const foundUser = await Users.findOne({
    where: {
      username,
    },
    attributes: {
      exclude: ['password'],
    },
  });
  return foundUser || reject(404);
};

module.exports = {
  findUserByUserName,
};
