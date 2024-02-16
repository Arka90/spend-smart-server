const dotenv = require("dotenv");
dotenv.config();

const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const AppError = require("./utils/appError");
const globalErrorHandeler = require("./controllers/errorController");

const authRoute = require("./routes/authRoute");
const expenseRoute = require("./routes/expenseRoute");
const incomeRoute = require("./routes/incomeRoute");
const newsRoute = require("./routes/newsRoute");

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use("/api/v1/users", authRoute);
app.use("/api/v1/expenses", expenseRoute);
app.use("/api/v1/income", incomeRoute);
app.use("/api/v1/news", newsRoute);
// handelling undefined routes
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
