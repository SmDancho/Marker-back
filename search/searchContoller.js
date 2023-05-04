const Post = require('../models/post');

const search = async (req, res) => {
  try {
    const { request } = req.body;
    const searchRegex = new RegExp(request, 'i');
    Post.find({
      $or: [
        { title: searchRegex },
        { topic: searchRegex },
        { text: searchRegex },
        { group: searchRegex },
        { tags: searchRegex },
        { 'comments.text': searchRegex },
      ],
    }).exec((err, articles) => {
      err && console.log(err);
      return res.json(articles);
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  search,
};
