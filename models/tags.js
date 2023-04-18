const { Schema, model } = require('mongoose');

const Tags = new Schema({
  tags: [String],
});

module.exports = model('Tags', Tags);
