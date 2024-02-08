const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Expense = require("../models/expenseModel");

exports.createExpense = catchAsync(async (req, res) => {
  const cuurentUser = req.user;

  const expense = await Expense.create({ ...req.body, user: cuurentUser._id });

  res.status(201).json({
    status: "success",
    data: {
      data: expense,
    },
  });
});

exports.updateExpense = catchAsync(async (req, res) => {
  const cuurentUser = req.user;
});

exports.deleteExpense = catchAsync(async (req, res) => {
  const cuurentUser = req.user;
});

exports.getAllExpenses = catchAsync(async (req, res) => {
  const cuurentUser = req.user;

  const expenses = await Expense.find();
});

exports.getExpenseById = catchAsync(async (req, res) => {
  const cuurentUser = req.user;

  const expenses = await Expense.find();
});
