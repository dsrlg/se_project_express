const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const { PORT = 3001 } = process.env;
const errorHandler = require("./middlewares/errorHandler");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {})
  .catch(console.error);

const routes = require("./routes");

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

//app.use(errorHandler);
app.use((err, req, res, next) => {
  console.error(err);
  return res
    .status(CODES.INTERNAL_SERVER)
    .send({ message: "An error occurred on the server" });
});

app.listen(PORT, () => {
  console.log("Starting");
});

// ... all other app.use() statements
