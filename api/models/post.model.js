const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  post_id: Number,
  hour: Number,
  post_date: { type: Date, default: Date.now() },
  post: String,
  post_title: String,
  post_thumbnail: String,
  post_content: String,
  created_at: { type: Date, default: Date.now() },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    require: true
  }
});

module.exports = mongoose.model("Post", postSchema);
