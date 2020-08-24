var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var CommentSchema = new Schema({
  creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: String,
  image: String,
  likes: { type: Number, default: 0 },
  replies: {
    type: [CommentSchema],
    default: [],
  },
  created: { type: Date, default: Date.now },
});

module.exports = CommentSchema;
