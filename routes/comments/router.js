const express = require('express');
const validator = require('express-validator');

const router = express.Router();

const { Comments, Users, Posts } = require('../../models');
const { checkToken } = require('../../utils/checkToken');
const { control, reject } = require('../../utils/control');

// 해당 글의 댓글 목록 조회
router.get('/:post_id', [
  validator.param('post_id').isInt(),
  validator.query('limit').optional().isInt({ min: 0, max: 100 }).toInt(),
  validator.query('offset').optional().isInt({ min: 0 }).toInt(),
], control(async ({ req }) => {
  const { limit = 20, offset = 0 } = req.query;
  const { post_id } = req.params;
  const { rows, count } = await Comments.findAndCountAll({
    where: {
      post_id,
      deleted_at: null,
    },
    limit,
    offset,
    include: [{
      model: Users,
      attributes: ['id', 'username', 'image_url', 'name'],
    }],
  });
  return {
    rows, count,
  };
}));

// 해당 글의 댓글 등록
// 포스트맨 상에는 바디에 컨텐트만
router.post('/:post_id', [
  validator.param('post_id').isInt(),
  validator.body('content').isLength({ min: 1, max: 1000 }),
], checkToken, control(async ({ req }) => {
  const { content } = req.body;
  const { post_id } = req.params;
  const { user } = req;
  if (!user) return reject(401);
  const result = await Comments.create({
    content,
    user_id: user.id,
    post_id,
    name: user.name,
  });
  return result;
}));

// 댓글 수정
router.put('/:comment_id', [
  validator.param('comment_id').isInt(),
  validator.body('content').isLength({ min: 1, max: 1000 }),
], checkToken, control(async ({ req }) => {
  const { content } = req.body;
  const { comment_id } = req.params;
  const { user } = req;
  if (!user) return reject(401);
  const result = await Comments.update({
    content,
  }, {
    where: {
      id: comment_id,
      user_id: user.id,
    },
  });
  return result;
}));

// 댓글 삭제
// 포스트맨 바디에 아무것도 안 실어도 됨
router.delete('/:comment_id', [
  validator.param('comment_id').isInt(),
], checkToken, control(async ({ req }) => {
  const { comment_id } = req.params;
  const { user } = req;
  if (!user) return reject(401);
  const [result] = await Comments.update({
    status: 'DELETED',
    deleted_at: Date.now(),
  }, {
    where: {
      user_id: user.id,
      id: comment_id,
    },
  });
  return result;
}));

module.exports = router;
