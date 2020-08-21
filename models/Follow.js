var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var FollowSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  target: { type: Schema.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Follow", FollowSchema);
