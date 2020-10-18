const express = require('express');
const { Comments } = require('../../models');

const router = express.Router();

// 댓글 목록 조회
router.get('/comments', async (req, res) => {
  try {
    const comments = await Comments.findAll();
    console.log({ comments });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// 댓글 등록
router.post('/comments', async (req, res) => {
  try {
    '';
  } catch (err) {
    res.status(500).json(err.message);
  }
});
