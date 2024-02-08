const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  category: {
    type: String,
    enum: ["Salary", "Freelancing", "Passive Income", "Ohers"],
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

const Income = mongoose.model("income", incomeSchema);
module.exports = Income;
