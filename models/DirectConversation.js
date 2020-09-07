var mongoose = require("mongoose");
var participant = require("./Participant");
var Schema = mongoose.Schema;

var DirectConversation = new Schema({
  participants: [participant],
  conversationId: { type: String, required: true },
  last_message: { type: Date },
});
module.exports = mongoose.model("DirectConversation", DirectConversation);
