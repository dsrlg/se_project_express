const CODES = require("../utils/codes");

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CODES.FORBIDDEN;
  }
}

module.exports = ForbiddenError;