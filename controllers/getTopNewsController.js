const axios = require("axios");
const catchAsync = require("../utils/catchAsync");

exports.getTopNews = catchAsync(async (req, res) => {
  const options = {
    method: "GET",
    url: `https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=${process.env.NEWS_API_KEY}`,
  };

  const news = await axios.request(options);

  return res.status(200).json({ data: news.data.articles });
});
