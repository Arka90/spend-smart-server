const express = require("express");
const authController = require("./../controllers/authController");
const topNewsController = require("./../controllers/getTopNewsController");
const AppError = require("../utils/appError");

const router = express.Router();

router.use(authController.protect);
router.get("/", topNewsController.getTopNews);

router.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

module.exports = router;
