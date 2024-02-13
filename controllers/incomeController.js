const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Income = require("../models/incomeModel");

exports.createIncome = catchAsync(async (req, res) => {
  const cuurentUser = req.user;

  const income = await Income.create({
    ...req.body,
    user: cuurentUser._id,
    date: new Date(req.body.date),
  });

  res.status(201).json({
    status: "success",
    data: {
      data: income,
    },
  });
});

exports.updateIncome = catchAsync(async (req, res, next) => {
  const cuurentUser = req.user;

  const income = await Income.findOne({ _id: req.params.id });

  if (!income || income.user.toString() !== cuurentUser._id.toString()) {
    return next(new AppError("No income found with that ID", 404));
  }

  const updatedIncome = await Income.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      data: updatedIncome,
    },
  });
});

exports.deleteIncome = catchAsync(async (req, res, next) => {
  const cuurentUser = req.user;

  const income = await Income.findOne({ _id: req.params.id });

  if (!income || income.user.toString() !== cuurentUser._id.toString()) {
    return next(new AppError("No income found with that ID", 404));
  }

  const updatedIncome = await Income.findOneAndDelete({ _id: req.params.id });

  res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.getAllIncome = catchAsync(async (req, res, next) => {
  const cuurentUser = req.user;
  const income = await Income.find({ user: cuurentUser._id });

  // Total amount  of all incomes for the current logged in user
  const totalIncomeAmount = income.reduce((acc, income) => {
    return income.amount + acc;
  }, 0);

  return res.status(200).json({
    status: "success",
    data: {
      totalIncomeAmount,
      income,
    },
  });
});

exports.getIncomeById = catchAsync(async (req, res, next) => {
  const cuurentUser = req.user;

  const income = await Income.findOne({ _id: req.params.id });

  if (!income || income.user.toString() !== cuurentUser._id.toString()) {
    return next(new AppError("No income found with that ID", 404));
  }

  return res.status(200).json({
    status: "success",
    data: {
      income,
    },
  });
});

exports.getMonthlyIncome = catchAsync(async (req, res, next) => {
  const cuurentUser = req.user;

  const currentDate = new Date();
  const month = req.query.month || currentDate.getMonth() + 1;
  const year = req.query.year || currentDate.getFullYear();

  const income = await Income.aggregate([
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

  const totalMonthlyIncome = income.reduce((acc, income) => {
    return acc + income.amount;
  }, 0);

  res.status(200).json({
    status: "success",
    data: {
      totalMonthlyIncome,
      income,
    },
  });
});
