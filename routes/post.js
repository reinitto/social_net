module.exports = function () {
  const Post = require("../models/Post");
  const express = require("express");
  const router = express.Router();

  router.post("/submit", async (req, res) => {
    try {
      if (!req.body || !req.body.body) {
        res.status(422).json({ error: "Missing required parameters" });
      }
      const { body, image } = req.body;
      const { _id } = req.user;
      const newPost = new Post({
        body,
        image,
        creator: _id,
      });
      try {
        await newPost.save();
        res.json({ status: "ok" });
      } catch (err) {
        console.log("post save error", err);
        res.status(500).json({ error: "Oops! Something went wrong!" });
      }
    } catch (error) {
      console.log(error);
    }
  });
  // Adds comment to post
  // postId, comment contents
  router.post("/comment", async (req, res) => {
    try {
      if (!req.body || !req.body.postId || !req.body.content) {
        res.status(422).json({ error: "Missing required parameters" });
      }
      const { postId, content } = req.body;

      const { _id } = req.user;
      const newComment = {
        text: content.text,
        image: content.image,
        creator: _id,
      };
      try {
        // find Post and push in comment
        await Post.findByIdAndUpdate(postId, {
          $push: { comments: newComment },
        }).exec();
        res.json({ status: "ok" });
      } catch (err) {
        console.log("post save error", err);
        res.status(500).json({ error: "Oops! Something went wrong!" });
      }
    } catch (error) {
      console.log(error);
    }
  });
  return router;
};
