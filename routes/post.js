module.exports = function () {
  const Post = require("../models/Post");
  const express = require("express");
  const router = express.Router();

  router.post("/submit", async (req, res) => {
    try {
      if (!req.body || !req.body.post || !req.body.post.body) {
        res.status(422).json({ error: "Missing required parameters" });
      }
      const {
        post: { body, image },
      } = req.body;
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
  return router;
};
