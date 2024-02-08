const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  category: {
    type: String,
    enum: ["Food", "Transportation", "Housing", "Health", "Others"],
  },

  amount: {
    type: Number,
    required: [true, "Provide a amount"],
  },

  date: {
    type: Date,
    required: [true, "Provide a date"],
  },
});

const Expense = mongoose.model("Expense", expenseSchema);
module.exports = Expense;
