const express = require("express");
const authController = require("./../controllers/authController");
const chatController = require("../controllers/chatController");
const AppError = require("../utils/appError");

const router = express.Router();
router.use(authController.protect);

router.post("/", chatController.createChannel);
router.get("/", chatController.getAllMembers);

module.exports = router;
