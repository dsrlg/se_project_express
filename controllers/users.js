const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User= require("../models/user");
const CODES = require("../utils/codes");
const { JWT_SECRET } = require("../utils/config");
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-err');
const InternalServerError = require('../errors/internal-server-error');
const UnauthorizedError = require('../errors/auth-error');
const ConflictError = require('../errors/conflict-error');
const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    next(new BadRequestError("The email and password fields are requried"));
    //  .send({ message: "The email and password fields are requried" });
  }

  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      res.status(CODES.SUCCESS).send(userObj);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError("Email already exists"));
        //return res.status(CODES.CONFLICT)
        //.send({ message: "Email already exists" });
      }
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid input"));
      }
      next(new InternalServerError("An error has occurred on the server"));
    });

};
const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )

    .orFail()
    .then((user) => {
      res.status(CODES.SUCCESS).send(user);
    })
    .catch((err) => {

if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError(err.message));
      }
      if (err.name === "ValidationError") {
       next(new BadRequestError(err.message));
      }
      next(new InternalServerError(err.message));
    });
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user; // Assuming req.user is set by auth middleware
  User.findById(_id)
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError(err.message));
      }
      if (err.name === "CastError") {
        next(new BadRequestError(err.message));
      }
      next(new InternalServerError(err.message));
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
   next(new BadRequestError("Email and password are required"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(CODES.SUCCESS).send({ token });
    })
    .catch((err) => {

      if (err.message === "Incorrect email or password") {
        next(new UnauthorizedError(err.message));
      } else {
        next(new InternalServerError(err.message));
      }
    });
};
module.exports = { updateUser, createUser, getCurrentUser, loginUser };
