var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var GroupMessage = new Schema({
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: "GroupConversation",
    required: true,
  },
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: String,
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model("GroupMessage", GroupMessage);
