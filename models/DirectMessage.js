var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var DirectMessage = new Schema({
  direct_conversationId: { type: String, required: true },
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: String,
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DirectMessage", DirectMessage);
