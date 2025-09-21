const CODES = require("../utils/codes");

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CODES.BAD_REQUEST;
  }
}

module.exports = BadRequestError;