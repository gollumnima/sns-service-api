const express = require('express');

const router = express.Router();

const { Posts, Users } = require('../../models');
const { checkToken } = require('../../utils/checkToken');
const { control, reject } = require('../../utils/control');

const someServiceWithError = async () => reject(400);

// 라우터 두번째 인자는 함수여야 하기 깨문에 컨트롤이 실행된 결과가 함수여야 작동이 됨
router.get('/test', control(async ({ next }) => {
  await someServiceWithError();
  return {
    foo: 1,
  };
}));

router.get('/', control(async ({ req }) => {
  const { limit, offset } = req.query;
  const { rows, count } = await Posts.findAndCountAll({ limit, offset }, {
    where: {
      deleted_at: null,
    },
    include: [{
      model: Users,
      attributes: {
        exclude: ['password'],
      },
    }],
  });
  return { rows, count };
}));

// async (req, res) => {
//   try {
//     const { rows, count } = await Posts.findAndCountAll({
//       where: {
//         deleted_at: null,
//       },
//       include: [{
//         model: Users,
//         attributes: {
//           exclude: ['password'],
//         },
//       }],
//     });
//     res.json({
//       rows,
//       count,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

router.post('/', checkToken, control(async ({ req }) => {
  const { id: user_id } = req.user;
  const { content } = req.body;
  const result = await Posts.create({
    content, user_id,
  });
  return result;
}));

// async (req, res) => {
//   try {
//     const { id: user_id } = req.user;
//     const { content } = req.body;
//     const result = await Posts.create({
//       content,
//       user_id,
//     });
//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// }

router.get('/:id', control(async ({ req }) => {
  const { id } = req.params;
  const post = await Posts.findOne({
    where: { id },
    include: [
      {
        model: Users,
        attributes: {
          exclude: ['password'],
        },
      },
    ],
  });
  if (!post) return reject(401);
  return post;
}));

// async (req, res) => {
//   try {
//     const { id } = req.params;
//     const post = await Posts.findOne({
//       where: { id },
//       include: [
//         {
//           model: Users,
//           attributes: {
//             exclude: ['password'],
//           },
//         },
//       ],
//     });
//     if (!post) return res.status(401).json({});
//     return res.json(post);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// 수정 메소드
router.put('/:id', checkToken, control(async ({ req }) => {
  const { id } = req.params;
  const { user } = req;
  const { content } = req.body;

  const [result] = await Posts.update({
    content,
  }, {
    where: {
      id,
      user_id: user.id,
    },
  });

  if (!result) return reject(404);
  return result;
}));

// checkToken, async (req, res) => {
//   try {
//     // 외부 세계에서 가져오는 값들
//     const { id } = req.params;
//     const { user } = req;
//     const { content } = req.body;

//     // 내부 서비스로직으로 올바르게 전달
//     const [result] = await Posts.update({
//       content,
//     }, {
//       where: {
//         id,
//         user_id: user.id,
//       },
//     });

//     // 외부 세계로 결과물을 응답
//     if (!result) return res.status(404).json({});
//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// 삭제 메소드
router.delete('/:id', checkToken, control(async ({ req }) => {
  const { id } = req.params;
  const { user } = req;
  const [result] = await Posts.update({
    status: 'DELETED',
    deleted_at: Date.now(),
  }, {
    where: {
      id, user_id: user.id,
    },
  });
  if (!result) return reject(404);
  return result;
}));

// checkToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { user } = req;
//     const [result] = await Posts.update({
//       status: 'DELETED',
//       deleted_at: Date.now(),
//     }, {
//       where: {
//         id,
//         user_id: user.id,
//       },
//     });
//     if (!result) return res.status(404).json({});
//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// }

module.exports = router;
