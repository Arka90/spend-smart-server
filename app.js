const dotenv = require("dotenv");
dotenv.config();

const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");

const AppError = require("./utils/appError");
const globalErrorHandeler = require("./controllers/errorController");

const authRoute = require("./routes/authRoute");

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use("/api/v1/users", authRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandeler);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB connected  successfully!");
  })
  .catch((error) => console.log(error));

module.exports = app;
