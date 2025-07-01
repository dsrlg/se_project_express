const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const CODES = require("../utils/codes");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(CODES.BAD_REQUEST)
      .send({ message: "The email and password fields are requried" });
  }

  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      console.log("User created successfully:", user);
      const userObj = user.toObject();
      delete userObj.password;
      res.status(CODES.SUCCESS).send(userObj);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res
          .status(CODES.CONFLICT)
          .send({ message: "Email already exists" });
      }
      if (err.name === "ValidationError") {
        return res.status(CODES.BAD_REQUEST).send({ message: "Invalid input" });
      }
      return res.status(CODES.INTERNAL_SERVER).send({
        message: "An error has occurred on the server",
      });
    });

};
const updateUser = (req, res) => {
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
return res.status(CODES.NOT_FOUND).send({ message: err.message });
      }
      if (err.name === "ValidationError") {
        return res.status(CODES.BAD_REQUEST).send({ message: err.message });
      }
      return res
        .status(CODES.INTERNAL_SERVER)
        .send({ message: "An error has occurred on the server" });
    });
};

const getCurrentUser = (req, res) => {
  const { _id } = req.user; // Assuming req.user is set by auth middleware
  User.findById(_id)
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(CODES.NOT_FOUND).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(CODES.BAD_REQUEST).send({ message: err.message });
      }
      return res
        .status(CODES.INTERNAL_SERVER)
        .send({ message: "An error has occurred on the server" });
    });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(CODES.BAD_REQUEST)
      .send({ message: "Email and password are required" });
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
        return res
          .status(CODES.UNAUTHORIZED)
          .send({ message: "Incorrect email or password" });
      }
      return res.status(CODES.INTERNAL_SERVER).send({ message: err.message });
    });
};
module.exports = { updateUser, createUser, getCurrentUser, loginUser };
