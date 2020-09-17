// FRIENDSHIP STATUSES
// "NOT_FRIENDS", "REQUESTED", "PENDING", "FRIENDS"
const direct_conversationId = (userId, receiverId) => {
  return `${receiverId}` > `${userId}`
    ? `${receiverId}${userId}`
    : `${userId}${receiverId}`;
};
module.exports = function () {
  const User = require("../models/User");
  const Friends = require("../models/Friends");
  const DirectConversation = require("../models/DirectConversation");
  const express = require("express");
  const router = express.Router();
  // send friend request
  router.post("/add", async (req, res) => {
    if (!req.body || !req.body.recipient) {
      res.status(422).json({ error: "Missing required parameters" });
      return;
    }
    try {
      const UserA = req.user._id;
      const { recipient: UserB } = req.body;
      const requesterDoc = await Friends.findOneAndUpdate(
        { requester: UserA, recipient: UserB },
        { $set: { status: "REQUESTED" } },
        { upsert: true, new: true }
      );
      const recipientDoc = await Friends.findOneAndUpdate(
        { requester: UserB, recipient: UserA },
        { $set: { status: "PENDING" } },
        { upsert: true, new: true }
      );
      await User.findOneAndUpdate(
        { _id: UserA },
        { $addToSet: { friends: requesterDoc._id } }
      );
      await User.findOneAndUpdate(
        { _id: UserB },
        { $addToSet: { friends: recipientDoc._id } }
      );
      res.json({ status: "OK" });
    } catch (error) {
      console.log(error);
      res.json({ error: "request failed" });
    }
  });
  // Accept friend requesst
  router.post("/accept", async (req, res) => {
    if (!req.body || !req.body.recipient) {
      res.status(422).json({ error: "Missing required parameters" });
      return;
    }
    try {
      const UserA = req.user._id;
      const UserB = req.body.recipient;
      await Friends.findOneAndUpdate(
        { requester: UserA, recipient: UserB },
        { $set: { status: "FRIENDS", created: new Date() } }
      );
      await Friends.findOneAndUpdate(
        { recipient: UserA, requester: UserB },
        { $set: { status: "FRIENDS", created: new Date() } }
      );
      // create directConversation
      DirectConversation.findOneAndUpdate({
        participants: [{ user: UserA }, { user: UserB }],
        conversationId: direct_conversationId(UserA, UserB),
      });

      res.json({ status: "OK" });
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  });
  // Reject friends request
  // Also works for delete existing friendship
  router.post("/reject", async (req, res) => {
    if (!req.body || !req.body.recipient) {
      res.status(422).json({ error: "Missing required parameters" });
      return;
    }
    try {
      const UserA = req.user._id;
      const UserB = req.body.recipient;
      const docA = await Friends.findOneAndRemove({
        requester: UserA,
        recipient: UserB,
      });
      const docB = await Friends.findOneAndRemove({
        recipient: UserA,
        requester: UserB,
      });
      await User.findOneAndUpdate(
        { _id: UserA },
        { $pull: { friends: docA._id } }
      );
      await User.findOneAndUpdate(
        { _id: UserB },
        { $pull: { friends: docB._id } }
      );
      res.json({ status: "ok" });
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  });

  return router;
};
