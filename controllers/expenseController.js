const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Expense = require("../models/expenseModel");

exports.createExpense = catchAsync(async (req, res) => {
  const cuurentUser = req.user;

  const expense = await Expense.create({
    ...req.body,
    user: cuurentUser._id,
    date: new Date(req.body.date),
  });

  res.status(201).json({
    status: "success",
    data: {
      data: expense,
    },
  });
});

exports.updateExpense = catchAsync(async (req, res, next) => {
  const cuurentUser = req.user;

  const expense = await Expense.findOne({ _id: req.params.id });

  if (!expense || expense.user.toString() !== cuurentUser._id.toString()) {
    return next(new AppError("No expense found with that ID", 404));
  }

  const updatedExpense = await Expense.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      data: updatedExpense,
    },
  });
});

exports.deleteExpense = catchAsync(async (req, res, next) => {
  const cuurentUser = req.user;

  const expense = await Expense.findOne({ _id: req.params.id });

  if (!expense || expense.user.toString() !== cuurentUser._id.toString()) {
    return next(new AppError("No expense found with that ID", 404));
  }

  const updatedExpense = await Expense.findOneAndDelete({ _id: req.params.id });

  res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.getAllExpenses = catchAsync(async (req, res, next) => {
  const cuurentUser = req.user;
  const expenses = await Expense.find({ user: cuurentUser._id });

  // Total amount  of all expenses for the current logged in user
  const totalExpenseAmount = expenses.reduce((acc, expense) => {
    return expense.amount + acc;
  }, 0);

  return res.status(200).json({
    status: "success",
    data: {
      totalExpenseAmount,
      expenses,
    },
  });
});

exports.getExpenseById = catchAsync(async (req, res, next) => {
  const cuurentUser = req.user;

  const expense = await Expense.findOne({ _id: req.params.id });

  if (!expense || expense.user.toString() !== cuurentUser._id.toString()) {
    return next(new AppError("No expense found with that ID", 404));
  }

  return res.status(200).json({
    status: "success",
    data: {
      expense,
    },
  });
});

exports.getMonthlyExpense = catchAsync(async (req, res, next) => {
  const cuurentUser = req.user;

  const currentDate = new Date();
  const month = req.query.month || currentDate.getMonth() + 1;
  const year = req.query.year || currentDate.getFullYear();

  const expenses = await Expense.aggregate([
    {
      $match: {
        user: cuurentUser._id,
        date: {
          $gte: new Date(`${year}-${month}-01`),
          $lte: new Date(`${year}-${month}-31`),
        },
      },
    },
  ]);

  const totalMonthlyExpense = expenses.reduce((acc, expense) => {
    return acc + expense.amount;
  }, 0);

  res.status(200).json({
    status: "success",
    data: {
      totalMonthlyExpense,
      expenses,
    },
  });
});
