const express = require("express");
const authController = require("./../controllers/authController");
const AppError = require("../utils/appError");
//Calling Express Router

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

module.exports = router;
