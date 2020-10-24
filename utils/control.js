const control = (message, callback) => async (req, res, next) => {
  const result = await callback(req, next);
  res.json(result);
};

// 전통적인 컨트롤러는 라우팅부터 DAO 실행까지 처리하고, 결과물을 View에게 전달하는 것 까지
// but 라우팅은 express가 해주고 DAO는 미들웨어가 해주고 있고,
// 결과를 http 응답으로 반환해 view에 전달하는 것도 미들웨어/express..
