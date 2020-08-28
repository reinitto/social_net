// FRIENDSHIP STATUSES
// "NOT_FRIENDS", "REQUESTED", "PENDING", "FRIENDS"
module.exports = function () {
  const User = require("../models/User");
  const Friends = require("../models/Friends");
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
      ).exec();
      const recipientDoc = await Friends.findOneAndUpdate(
        { requester: UserB, recipient: UserA },
        { $set: { status: "PENDING" } },
        { upsert: true, new: true }
      ).exec();
      await User.findOneAndUpdate(
        { _id: UserA },
        { $push: { friends: requesterDoc._id } }
      ).exec();
      await User.findOneAndUpdate(
        { _id: UserB },
        { $push: { friends: recipientDoc._id } }
      ).exec();
      res.json({ status: "OK" });
    } catch (error) {
      console.log(error);
    }
  });
  // Accept friend requesst
  router.post("accept", async (req, res) => {
    if (!req.body || !req.body.recipient) {
      res.status(422).json({ error: "Missing required parameters" });
      return;
    }
    try {
      const UserA = req.user._id;
      const UserB = req.body.recipient;
      await Friends.findOneAndUpdate(
        { requester: UserA, recipient: UserB },
        { $set: { status: "FRIENDS" } }
      ).exec();
      await Friends.findOneAndUpdate(
        { recipient: UserA, requester: UserB },
        { $set: { status: "FRIENDS" } }
      ).exec();
      res.json({ status: "OK" });
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  });
  // Reject friends request
  // Also works for delete existing friendship
  router.post("reject", async (req, res) => {
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
      }).exec();
      const docB = await Friends.findOneAndRemove({
        recipient: UserA,
        requester: UserB,
      }).exec();
      await User.findOneAndUpdate(
        { _id: UserA },
        { $pull: { friends: docA._id } }
      ).exec();
      await User.findOneAndUpdate(
        { _id: UserB },
        { $pull: { friends: docB._id } }
      ).exec();
      res.json({ status: "ok" });
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  });

  return router;
};
