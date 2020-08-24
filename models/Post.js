var commentSchema = require("./Comment");
var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var PostSchema = new Schema({
  creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  body: String,
  image: String,
  likes: Number,
  comments: [commentSchema],
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", PostSchema);

// Posts:
//   id:
//   authorid:
//   content:
//   total_views:
//   tags: array of String
//   likes: array of Likes {[
//          liked_by: user_id
//      ],...}
//   comments: array of Comments {[
//      author_id: ...
//      comment: ...
//      reactions: array of Comments {[],...}
//      likes: array of Likes {[
//          liked_by: user_id
//           ],...}
//       ],...}
