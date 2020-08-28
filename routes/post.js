module.exports = function () {
  const Post = require("../models/Post");
  const express = require("express");
  const router = express.Router();

  router.post("/submit", async (req, res) => {
    try {
      if (!req.body || !req.body.body) {
        res.status(422).json({ error: "Missing required parameters" });
      } else {
        const { _id } = req.user;
        const newPost = new Post({
          ...req.body,
          creator: _id,
        });
        try {
          await newPost.save();
          res.json({ status: "ok" });
        } catch (err) {
          console.log("post save error", err);
          res.status(500).json({ error: "Oops! Something went wrong!" });
        }
      }
    } catch (error) {
      console.log(error);
    }
  });
  router.delete("/submit", async (req, res) => {
    try {
      const { postId } = req.query;

      try {
        await Post.findByIdAndDelete(postId).exec();
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
      console.log("req.body", req.body);
      if (!req.body || !req.body.postId || !req.body.content) {
        res.status(422).json({ error: "Missing required parameters" });
      } else {
        const { postId, content } = req.body;
        let { commentPath } = req.body;
        const { _id } = req.user;
        const newComment = {
          text: content.text,
          image: content.image,
          creator: _id,
        };

        try {
          // top level comment
          if (!commentPath) {
            // find Post and push in comment
            await Post.findByIdAndUpdate(postId, {
              $push: { comments: newComment },
            }).exec();
            res.json({ status: "ok" });
          } else {
            const update = {};
            commentPath = "comments." + commentPath;
            update[commentPath] = newComment;
            await Post.findByIdAndUpdate(postId, {
              $push: update,
            }).exec();
            res.json({ status: "ok" });
          }
        } catch (err) {
          console.log("post save error", err);
          res.json({ error: "Oops! Something went wrong!" });
        }
      }
    } catch (error) {
      console.log(error);
    }
  });

  //Like COmment
  router.post("/comment/like", async (req, res) => {
    try {
      if (!req.body || !req.body.postId) {
        res.status(422).json({ error: "Missing required parameters" });
      } else {
        try {
          const { postId, commentPath } = req.body;
          const { _id } = req.user;
          const update = {};
          update["comments." + commentPath + ".likedBy"] = _id;
          await Post.findByIdAndUpdate(postId, {
            $addToSet: update,
          }).exec();
          res.json({ status: "ok" });
        } catch (err) {
          console.log("post save error", err);
          res.json({ error: "Oops! Something went wrong!" });
        }
      }
    } catch (error) {
      console.log(error);
    }
  });
  //Unlike Comment
  router.post("/comment/unlike", async (req, res) => {
    try {
      if (!req.body || !req.body.postId) {
        res.status(422).json({ error: "Missing required parameters" });
      } else {
        try {
          const { postId, commentPath } = req.body;
          const { _id } = req.user;
          const update = {};
          update["comments." + commentPath + ".likedBy"] = _id;
          await Post.findByIdAndUpdate(postId, {
            $pull: update,
          }).exec();
          res.json({ status: "ok" });
        } catch (err) {
          console.log("post save error", err);
          res.json({ error: "Oops! Something went wrong!" });
        }
      }
    } catch (error) {
      console.log(error);
    }
  });

  // Like Post
  router.post("/like", async (req, res) => {
    try {
      if (!req.body || !req.body.postId) {
        res.status(422).json({ error: "Missing required parameters" });
      } else {
        const { postId } = req.body;

        const { _id } = req.user;

        try {
          // find Post and push in comment
          await Post.findByIdAndUpdate(postId, {
            $addToSet: { likedBy: _id },
          }).exec();
          res.json({ status: "ok" });
        } catch (err) {
          console.log("post save error", err);
          res.status(500).json({ error: "Oops! Something went wrong!" });
        }
      }
    } catch (error) {
      console.log(error);
    }
  });
  // unlike POst
  router.post("/unlike", async (req, res) => {
    try {
      if (!req.body || !req.body.postId) {
        res.status(422).json({ error: "Missing required parameters" });
      } else {
        const { postId } = req.body;

        const { _id } = req.user;

        try {
          // find Post and push in comment
          await Post.findByIdAndUpdate(postId, {
            $pull: { likedBy: _id },
          }).exec();
          res.json({ status: "ok" });
        } catch (err) {
          console.log("post save error", err);
          res.status(500).json({ error: "Oops! Something went wrong!" });
        }
      }
    } catch (error) {
      console.log(error);
    }
  });
  return router;
};
