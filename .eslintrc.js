module.exports = {
  env: {
    browser: false,
    es2020: true,
    node: true,
  },
  extends: ['airbnb-base'],
  rules: {
    'arrow-parens': ['warn', 'as-needed'],
    // 화살표 함수의 파라미터가 하나일때 괄호 생략
    'no-unused-vars': ['off'],
    camelcase: ['off'],
    'no-underscore-dangle': ['off'],
    'no-console': ['off'],
    'max-len': ['off'],
  },
};
