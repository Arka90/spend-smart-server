const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const { StreamChat } = require("stream-chat");

const streamChat = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_PRIVATE_API_KEY
);

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const resp = await streamChat.upsertUser({
    id: newUser._id,
    name: newUser.username,
  });

  console.log(resp);

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  //1) Email and password exists
  if (!username || !password) {
    return next(new AppError("Please Provide username and password", 400));
  }

  //2) Check if user exists && password is correct
  const user = await User.findOne({ username }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect Passoward or Email", 401));
  }

  const token = streamChat.createToken(JSON.stringify(user._id));

  console.log("Token for chat app", token);

  //3) If everything is OK, send token to client
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  //1) Get token and check if its there

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }
  //2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3) If the user still exists
  const cuurentUser = await User.findById(decoded.id);

  if (!cuurentUser)
    return next(
      new AppError("The user belonging to this token no longer exists", 401)
    );

  //Grant Access to prected Route
  req.user = cuurentUser;
  next();
});
