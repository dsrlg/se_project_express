const CODES = require("../utils/codes");

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CODES.UNAUTHORIZED;
  }
}

module.exports = UnauthorizedError;