const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const CODES = require("../utils/codes");

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(CODES.UNAUTHORIZED).send({message:"Authorization required"});
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    const error = new Error('Authorization required');
    error.statusCode = CODES.UNAUTHORIZED;

    next(error);
    //return res.status( CODES.UNAUTHORIZED).send({message:"Authorization required"});
  }
};

module.exports = authMiddleware;