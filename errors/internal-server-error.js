const CODES = require("../utils/codes");

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CODES.INTERNAL_SERVER;
  }
}

module.exports = InternalServerError;