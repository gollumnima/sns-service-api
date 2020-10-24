const express = require('express');

const router = express.Router();

const { Comments, Users, Posts } = require('../../models');
const { checkToken } = require('../../utils/checkToken');

// 해당 글의 댓글 목록 조회
router.get('/:post_id', async (req, res) => {
  const { post_id } = req.params;
  try {
    const { rows, count } = await Comments.findAndCountAll({
      where: {
        post_id,
        deleted_at: null, // 또는 status: 'POSTED',
      },
      include: [{
        model: Users,
        attributes: {
          exclude: ['password'], // 이거 안 쓰면 비번 보임!!
        },
      }],

    });
    res.json({
      rows,
      count,
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// 해당 글의 댓글 등록
// 포스트맨 상에는 바디에 컨텐트만
router.post('/:post_id', checkToken, async (req, res) => {
  try {
    const { content } = req.body;
    const { post_id } = req.params;
    const { id: user_id } = req.user;
    const result = await Comments.create({
      content,
      user_id,
      post_id,
    });
    res.json(result);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// 댓글 수정
router.put('/:comment_id', checkToken, async (req, res) => {
  try {
    console.log(req.params, 'papap');
    const { content } = req.body;
    const { comment_id } = req.params;
    const { id: user_id } = req.user;

    const result = await Comments.update({
      content,
    }, {
      where: {
        id: comment_id, // 왼쪽은 데이터베이스상의 필드명이 id, 우측은 내가 설정한 이름
        user_id,
      },
    });
    return res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 댓글 삭제
// 포스트맨 바디에 아무것도 안 실어도 됨
router.delete('/:comment_id', checkToken, async (req, res) => {
  try {
    console.log(req.user, 'uss');
    const { comment_id } = req.params;
    const { id: user_id } = req.user;
    const [result] = await Comments.update({
      status: 'DELETED',
      deleted_at: Date.now(),
    }, {
      where: {
        user_id,
        id: comment_id,
      },
    });
    return res.json({}); // 굳이 삭제된 상태를 안봐도 되니깐 빈객체로!
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
