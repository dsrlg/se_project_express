const User = require('../models/user')
const CODES = require('../utils/codes')

const getUsers = (req, res) =>{
  User.find({})
.then((users)=>{
  res.status(201).send(users);})
.catch((err)=>{console.error(err)});
};

const createUsers = (req,res)=>{
const {name, avatar}= req.body;

User.create({name, avatar})
.then((user) =>{res.status(201).send(user);

}).catch((err)=>{
  if(err.name === "ValidationError"){
    return res.status(CODES.BAD_REQUEST).send({message: err.message});
  }
  return res.status(CODES.INTERNAL_SERVER).send({message: "An error has occurred on the server"});

  });

}

const getUser = (req, res) =>{
const {userId} = req.params;
  User.findById(userId)
.orFail()
.then((user) =>{res.status(200).send(user);})
.catch((err)=>{
console.error(err); if(err.name === "DocumentNotFoundError"){
    return res.status(CODES.NOT_FOUND).send({message: err.message});
  }   if(err.name === "CastError"){
    return res.status(CODES.BAD_REQUEST).send({message: err.message});
  }
  return res.status(CODES.INTERNAL_SERVER).send({message: "An error has occurred on the server"});
  });
}
module.exports = {getUsers, createUsers, getUser};