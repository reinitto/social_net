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
  read_by: { type: [Schema.Types.ObjectId], ref: "User" },
});

GroupMessage.pre("save", function (next) {
  let message = this;
  // add message sender to read_by list
  message.read_by.push(this.sender);
  next();
});

module.exports = mongoose.model("GroupMessage", GroupMessage);
