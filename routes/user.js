module.exports = function () {
  const User = require("../models/User");
  const express = require("express");
  const router = express.Router();

  router.post("/edit", (req, res) => {
    const {
      data: { email },
      data,
      updates_for,
    } = req.body;
    if (updates_for === "info") {
      console.log("updating info");

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
      console.log("updating profile_picture");
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
      console.log("updating background_picture");

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

  return router;
};
