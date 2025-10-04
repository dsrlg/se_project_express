const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const CODES = require("../utils/codes");
const UnauthorizedError = require("../errors/unauthorized-error");


const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new UnauthorizedError('Authorization required'));
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    const error = new UnauthorizedError('Authorization required');
    error.statusCode = CODES.UNAUTHORIZED;

    return next(error);
    // return res.status( CODES.UNAUTHORIZED).send({message:"Authorization required"});
  }
};

module.exports = authMiddleware;