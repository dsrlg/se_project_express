const express = require("express");
const mongoose = require("mongoose");
const userRouter =  require ("./routes/users.js");
const mainRouter = require("./routes/index.js");

const app = express();

const { PORT = 3001 } = process.env;


mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db')
.then(()=>{
console.log("Connected to DB");
})
.catch(console.error);

const routes = require('./routes')


//app.use("/", userRouter);
app.use(express.json());
//app.use("/", mainRouter);


app.use(routes);
app.listen(PORT, ()=>{

});
