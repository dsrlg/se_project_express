const express = require("express");
const mongoose = require("mongoose");


const app = express();

const { PORT = 3001 } = process.env;


mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db')
.then(()=>{
console.log("Connected to DB");
})
.catch(console.error);
app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133" // this is the test user ID
  };
  next();
});
const routes = require('./routes')


app.use(express.json());


app.use(routes);
app.listen(PORT, ()=>{

console.log("Starting")
});
