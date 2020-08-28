var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const friendsSchema = new Schema({
  requester: { type: Schema.Types.ObjectId, ref: "User" },
  recipient: { type: Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["NOT_FRIENDS", "REQUESTED", "PENDING", "FRIENDS"],
    default: "NOT_FRIENDS",
  },
  created: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Friends", friendsSchema);
