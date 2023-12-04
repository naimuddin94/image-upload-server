const mongoose = require("mongoose");

const articleSchema = mongoose.Schema({
  title: String,
  image: {
    type: String,
    required: true,
  },
});

module.exports = articleSchema;
