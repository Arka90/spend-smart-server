const express = require("express");
const authController = require("./../controllers/authController");
const expenseController = require("../controllers/expenseController");
const AppError = require("../utils/appError");

const router = express.Router();

router.use(authController.protect);
router.post("/", expenseController.createExpense);
router.patch("/:id", expenseController.updateExpense);
router.delete("/:id", expenseController.deleteExpense);
router.get("/:id", expenseController.getExpenseById);
router.get("/", expenseController.getAllExpenses);

router.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

module.exports = router;
