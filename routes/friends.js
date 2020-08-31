// FRIENDSHIP STATUSES
// "NOT_FRIENDS", "REQUESTED", "PENDING", "FRIENDS"
module.exports = function () {
  const User = require("../models/User");
  const Friends = require("../models/Friends");
  const express = require("express");
  const mongoose = require("mongoose");
  const ObjectId = mongoose.Types.ObjectId;
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
        { $addToSet: { friends: requesterDoc._id } }
      ).exec();
      await User.findOneAndUpdate(
        { _id: UserB },
        { $addToSet: { friends: recipientDoc._id } }
      ).exec();
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
      ).exec();
      await Friends.findOneAndUpdate(
        { recipient: UserA, requester: UserB },
        { $set: { status: "FRIENDS", created: new Date() } }
      ).exec();
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

  router.post("/friendsList", async (req, res) => {
    if (!req.body || !req.body.friendsIds) {
      res.status(422).json({ error: "Missing required parameters" });
      return;
    }
    try {
      let ids = req.body.friendsIds.map((id) => ObjectId(id));
      let userId = req.user._id;

      // From friends collection find all matching documents
      // then, if status is FRIENDS take the recipient field and use as _id to match documents in User collection and return as an array of confirmed friends
      console.log("requested friendsList", ids);
      // let userFriends = await Friends.find({ _id: { $in: ids } });
      // console.log("user friendships", userFriends);
      let userFriends = await Friends.aggregate([
        {
          $match: {
            _id: { $in: ids },
          },
        },
        { $group: { _id: "$status", friends: { $push: "$$ROOT" } } },
        // {
        //   $lookup:{
        //     from:User.collection.name,
        //     let:{status:"$_id",friends:"$friends"},

        //   }
        // }
        // {
        //   $lookup:{
        //     from:User.collection.name,
        //     let:{status:"$status",recipient:"$recipient"},
        //     pipeline:{
        //       $match:{

        //       }
        //     },
        //     as:"friends_list"
        //   }
        // }
        // {
        //   $project: {
        //     _id: 0,
        //     requester: 1,
        //     recipient: 1,
        //     status: 1,
        //   },
        // },
      ]);
      let friendLists = {};
      console.log("userFriends", userFriends);
      userFriends.forEach(async (col) => {
        if (col._id === "PENDING") {
          friendLists.pending = col.friends.map(
            (friendship) => friendship.recipient
          );
        }
        if (col._id === "REQUESTED") {
          friendLists.requested = col.friends.map(
            (friendship) => friendship.recipient
          );
        }
        if (col._id === "FRIENDS") {
          friendLists.friendsIds = col.friends.map(
            (friendship) => friendship.recipient
          );
        }
      });
      if (friendLists["friendsIds"] && friendLists["friendsIds"].length > 0) {
        friendLists.friends = await User.find({
          _id: { $in: friendLists.friendsIds },
        });
      }
      res.json({ friendLists: friendLists });
    } catch (error) {
      console.log(error);
      res.json({ error: "couldnt get friends" });
    }
  });

  return router;
};
