const { validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((err) => err.msg);
    return next(new ErrorResponse(messages.join('. '), 400));
  }
  next();
};

module.exports = validate;
