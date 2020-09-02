var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var GroupConversation = new Schema({
  admin: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  name: String,
  created: { type: Date, default: Date.now },
});
module.exports = mongoose.model("GroupConversation", GroupConversation);
