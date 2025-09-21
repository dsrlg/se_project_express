const CODES = require("../utils/codes");

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CODES.UNAUTHORIZED;
  }
}

module.exports = AuthorizationError;