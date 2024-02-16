const catchAsync = require("../utils/catchAsync");

exports.getTopNews = catchAsync(async (req, res) => {
  const news = fetch(
    `https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=${process.env.NEWS_API_KEY}`
  );

  return res.status(200).json({ news });
});
