const CODES = require("../utils/codes");

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CODES.CONFLICT;
  }
}

module.exports = ConflictError;