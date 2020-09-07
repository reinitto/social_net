var mongoose = require("mongoose");
var participant = require("./Participant");

var Schema = mongoose.Schema;
var GroupConversation = new Schema({
  admin: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  participants: [participant],
  name: String,
  created: { type: Date, default: Date.now },
});
module.exports = mongoose.model("GroupConversation", GroupConversation);
