const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: [true, "Provide a password"],
    minlength: 8,
    select: false,
  },
});

//hashing the password before saving the document in DB
userSchema.pre("save", async function (next) {
  //Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
