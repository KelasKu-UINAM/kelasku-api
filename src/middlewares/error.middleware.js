const { errorResponse } = require('../utils/response');

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  const errors = err.errors || [];

  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }

  return errorResponse(res, message, errors, statusCode);
};

module.exports = errorMiddleware;
