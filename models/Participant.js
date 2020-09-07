var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Participant = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  last_viewed: { type: Date },
});

module.exports = Participant;
