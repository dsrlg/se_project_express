const express = require("express");
const cors = require("cors");

const mongoose = require("mongoose");

const app = express();

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
  })
  .catch( console.error);

const routes = require("./routes");


app.use(cors());

app.use(express.json());




app.use(routes);



app.listen(PORT, () => {
  console.log("Starting");
});
