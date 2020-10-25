const HTTP_ERROR = Symbol('HTTP_ERROR');

const defaultHttpErrorMessages = {
  400: 'Bad Request',
  401: 'UnAuthorized',
  403: 'Forbidden',
  404: 'Not Found',
  500: 'Internal Server Error',
  503: 'Temporary Unavailable',
};

class HttpError extends Error {
  constructor(statusCode = 500, message, data) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this[HTTP_ERROR] = true;
  }
}

const reject = async (statusCode, message, data) => {
  const errorMessage = message || defaultHttpErrorMessages[statusCode] || 'Internal Server Error';
  const error = new HttpError(statusCode, errorMessage, data);
  return Promise.reject(error);
};

module.exports = {
  HTTP_ERROR, reject,
};
