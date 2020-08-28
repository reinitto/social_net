var commentSchema = require("./Comment");
var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var PostSchema = new Schema({
  creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  target: { type: Schema.Types.ObjectId, ref: "User" },
  body: String,
  image: String,
  likedBy: [Schema.Types.ObjectId],
  commentCount: { type: Number, default: 0 },
  comments: [commentSchema],
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", PostSchema);
