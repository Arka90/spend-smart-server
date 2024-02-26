const catchAsync = require("../utils/catchAsync");
const uniqid = require("uniqid");
const { StreamChat } = require("stream-chat");
const streamChat = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_PRIVATE_API_KEY
);

exports.createChannel = catchAsync(async (req, res) => {
  console.log(req.body);

  const channel = streamChat.channel("messaging", uniqid(), {
    created_by_id: req.user._id.toString(),
    name: req.body.name,
    members: req.body.members,
  });

  await channel.create();

  return res.status(201).json({
    status: "success",
    message: "Channel created successfully!",
  });
});

exports.getAllMembers = catchAsync(async (req, res) => {
  const users = (await streamChat.queryUsers({})).users;

  return res.status(200).json({
    status: "success",
    users,
  });
});
