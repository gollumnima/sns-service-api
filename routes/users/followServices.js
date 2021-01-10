const { Users, Images, Follows } = require('../../models');
const { control, reject } = require('../../utils/control');

const findFollowersOfUser = async (userId, { limit = 20, offset = 0 } = {}) => {
  const user = await Users.findByPk(userId);
  if (!user) return reject(404);
  const { rows, count } = await Follows.findAndCountAll({
    where: {
      followee_id: userId,
      deleted_at: null,
    },
    limit,
    offset,
    attributes: ['id', 'created_at'],
    include: [{
      as: 'Followers',
      model: Users,
      attributes: ['id', 'username', 'image_url'],
    }],
  });

  const sanitizedRows = rows.map(row => {
    const { Followers, ...data } = row.toJSON();
    const { id: user_id, username, image_url } = Followers;
    return {
      ...data,
      user_id,
      username,
      image_url,
    };
  });

  return {
    rows: sanitizedRows,
    count,
  };
};

const findFollowingsOfUser = async (userId, { limit = 20, offset = 0 } = {}) => {
  const user = await Users.findByPk(userId);
  if (!user) return reject(404);
  const { rows, count } = await Follows.findAndCountAll({
    where: {
      follower_id: userId,
      deleted_at: null,
    },
    limit,
    offset,
    attributes: ['id', 'created_at'],
    include: [{
      as: 'Followees',
      model: Users,
      attributes: ['id', 'username', 'image_url'],
    }],
  });

  const sanitizedRows = rows.map(row => {
    const { Followees, ...data } = row.toJSON();
    const { id: user_id, username, image_url } = Followees;
    return {
      ...data,
      user_id,
      username,
      image_url,
    };
  });

  return {
    rows: sanitizedRows,
    count,
  };
};

const followUser = async (follower_id, followee_id) => {
  console.log({ follower_id, followee_id });
  if (Number(followee_id) === Number(follower_id)) {
    return reject(400, '스스로 팔로우할 수 없습니다.');
  }
  const user = await Users.findByPk(followee_id);
  if (!user) return reject(404);
  const prevFollow = await Follows.findOne({
    where: {
      follower_id,
      followee_id,
      deleted_at: null,
    },
  });

  if (prevFollow) return prevFollow.dataValues;

  const nextFollow = await Follows.create({
    follower_id,
    followee_id,
  });

  return nextFollow;
};

const unfollowUser = async (follower_id, followee_id) => {
  const [result] = await Follows.update({
    deleted_at: Date.now(),
  }, {
    where: {
      follower_id,
      followee_id,
    },
  });

  return result || reject(404);
};

module.exports = {
  findFollowersOfUser,
  findFollowingsOfUser,
  followUser,
  unfollowUser,
};
