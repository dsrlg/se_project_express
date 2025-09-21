const CODES = require("../utils/codes");

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CODES.NOT_FOUND;
  }
}

module.exports = NotFoundError;