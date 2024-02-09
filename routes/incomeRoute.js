const express = require("express");
const authController = require("./../controllers/authController");
const incomeController = require("../controllers/incomeController");
const AppError = require("../utils/appError");

const router = express.Router();

router.use(authController.protect);
router.get("/", incomeController.getAllIncome);
router.get("/monthly", incomeController.getMonthlyIncome);
router.get("/:id", incomeController.getIncomeById);
router.post("/", incomeController.createIncome);
router.patch("/:id", incomeController.updateIncome);
router.delete("/:id", incomeController.deleteIncome);

router.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

module.exports = router;
