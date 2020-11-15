const { validator } = require('express-validator');
const { reject, HTTP_ERROR } = require('./reject');

const checkValidation = async req => {

};

const control = callback => async (req, res, next) => {
  try {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      await reject(400, 'Request Validation Failed', errors.array());
    }
    const result = await callback({ req, next });
    res.json(result);
  } catch (err) {
    if (err[HTTP_ERROR]) {
      const { statusCode, message, data } = err;
      console.log('내가 만든 에러');
      return res.status(statusCode).json({ message, data });
    }
    res.status(500).json({ message: err.message });
  }
};

// 클래스를 생성한 이후 레퍼러를 만들어 줌. -> 공개 생성자 패턴(?)

module.exports = {
  control,
  reject,
};

// 전통적인 컨트롤러는 라우팅부터 DAO 실행까지 처리하고, 결과물을 View에게 전달하는 것 까지
// but 라우팅은 express가 해주고 DAO는 미들웨어가 해주고 있고,
// 결과를 http 응답으로 반환해 view에 전달하는 것도 미들웨어/express..
