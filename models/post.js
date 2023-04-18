const { Schema, model } = require('mongoose');

const Post = new Schema({
  author: { type: String },
  image: { type: String },
  title: { type: String, required: true, text: true },
  topic: { type: String, required: true, text: true },
  tags: [String],
  raiting: [
    {
      userId: String,
      value: Number,
    },
  ],
  authorRaiting: { type: Number, required: true },
  text: { type: String, required: true, text: true },
  group: { type: String, required: true, text: true },
  likes: [
    {
      type: String,
    },
  ],
  comments: [
    {
      type: {
        username: String,
        text: String,
      },
      required: true,
      text: true,
    },
  ],
});

module.exports = model('Post', Post);
Post.index({
  title:1,
  topic: 1,
  text: 1,
  group:1,
  'comments.text': 1
 
}); 
