var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var PostSchema = new Schema({
  creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  body: String,
  image: String,
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", PostSchema);
