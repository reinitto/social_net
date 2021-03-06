const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const User = require("../models/User");
const Follow = require("../models/Follow");
const Post = require("../models/Post");
const express = require("express");
const router = express.Router();

const sortPosts = (a, b) => b.created - a.created;
module.exports = function () {
  router.post("/edit", (req, res) => {
    const { data, updates_for } = req.body;
    const { email } = req.user;
    if (updates_for === "info") {
      const {
        email,
        username,
        bio,
        social_profiles,
        first_name,
        last_name,
      } = data;
      User.updateOne(
        { email },
        {
          email,
          username,
          bio,
          social_profiles,
          first_name,
          last_name,
        },
        (err, result) => {
          if (err) {
            console.log("error updating user", err);
            res.json({ error: "Updating failed" });
          } else {
            console.log("updating info succeeded");
            res.json({ status: "ok" });
          }
        }
      );
    } else if (updates_for === "profile_picture") {
      const { profileImage } = data;
      User.updateOne(
        { email },
        {
          profile_photo: profileImage,
        },
        (err, result) => {
          if (err) {
            console.log("error updating user", err);
            res.json({ error: "Updating failed" });
          } else {
            console.log("updating profile_picture succeeded");

            res.json({ status: "ok" });
          }
        }
      );
    } else if (updates_for === "background_picture") {
      const { backgroundImage } = data;
      User.updateOne(
        { email },
        {
          cover_photo: backgroundImage,
        },
        (err, result) => {
          if (err) {
            console.log("error updating user", err);
            res.json({ error: "Updating failed" });
          } else {
            console.log("updating background_picture succeeded");

            res.json({ status: "ok" });
          }
        }
      );
    } else {
      res.json({
        error:
          "Please specify if the updates are for info profile_picture or background_picture",
      });
    }
  });

  router.post("/follow", async (req, res) => {
    if (!req.body || !req.body.target) {
      res.status(422).json({ error: "Missing required parameters" });
      return;
    }
    try {
      // check if user already follows target
      if (req.user.follow.includes(req.body.target)) {
        res.json({ error: "already following" });
        return;
      }
      let userId = req.user.id;
      // let userId = "5f3d81feb8192b4c9457a60a";
      let follow = new Follow();
      // follow.user = req.user.id;
      follow.user = userId;
      follow.target = req.body.target;
      await follow.save();
      // add follow id to user
      await User.findByIdAndUpdate(userId, {
        $addToSet: { follow: req.body.target },
      });
      res.json({ status: "ok" });
    } catch (error) {
      console.log(error);
      res.json({ error: "Following failed!" });
    }
  });
  router.post("/unfollow", async (req, res) => {
    if (!req.body || !req.body.target) {
      res.status(422).json({ error: "Missing required parameters" });
      return;
    }
    try {
      const userId = req.user.id;
      // const userId = "5f3d81feb8192b4c9457a60a";
      await Follow.findOneAndRemove({
        user: userId,
        target: req.body.target,
      });
      await User.findByIdAndUpdate(userId, {
        $pull: { follow: req.body.target },
      });
      res.json({ status: "ok" });
    } catch (error) {
      console.log(error);
      res.json({ error: "Unfollowing failed!" });
    }
  });

  router.get("/feed/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      //get follow field which consists of User ids
      //populate friends field and retrieve requester id which is a User id
      const user = await User.findById(userId).populate({
        path: "friends",
        model: "Friends",
        match: { status: "FRIENDS" },
        select: " requester -_id",
      });
      let followIds = user.follow.length > 0 ? user.follow : [];
      let friendsIds = user.friends.map((friend) => friend.requester);
      let postCreatorIds = [...followIds, ...friendsIds, userId];
      // find posts created by post creators
      const newsFeedPosts = await Post.find({
        $or: [{ creator: { $in: postCreatorIds } }, { target: userId }],
      })
        .sort({ created: -1 })
        .limit(100)
        .populate("creator");
      res.json({ feed: newsFeedPosts });
    } catch (error) {
      res.json({ error });
    }
  });

  router.get("/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
      res.json({ user });
    } catch (error) {
      console.log(error);
      res.json({ error: `Can't get user` });
    }
  });

  router.post("/getUsers", async (req, res) => {
    if (!req.body || !req.body.userIds) {
      res.status(422).json({ error: "Missing required parameters" });
      return;
    }
    try {
      const users = await User.find({
        _id: { $in: req.body.userIds },
      });
      res.json({ users });
    } catch (error) {
      console.log(error);
      res.json({ error: "couldnt find user" });
    }
  });

  return router;
};
