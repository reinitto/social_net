module.exports = function (passport) {
  const User = require("../models/User");
  const express = require("express");
  const router = express.Router();

  //

  router.post("/edit", passport.authenticate("local"), (req, res) => {
    const {
      name: { firstName, lastName },
      info: { bio, interests, social_profiles },
      pictures: { profile, background },
      username,
      email,
      password,
    } = req.body;
    User.updateOne(
      { email },
      {
        email,
        username,
        password,
        bio,
        interests,
        social_profiles,
        first_name: firstName,
        last_name: lastName,
        cover_photo: background,
        profile_photo: profile,
      },
      (err, user) => {
        if (err) {
          console.log("error updating user", err);
          res.json({ error: "Updating failed" });
        } else {
          res.json({ user });
        }
      }
    );
  });

  return router;
};
