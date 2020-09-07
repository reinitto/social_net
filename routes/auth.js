module.exports = function (passport) {
  const User = require("../models/User");
  const express = require("express");
  const { appName } = require("../client/src/constants.js");
  const router = express.Router();

  const mailjet = require("node-mailjet").connect(
    process.env.MAILJET_API,
    process.env.MAILJET_SECRET
  );
  const sendRegistrationEmail = async ({ username, email }) => {
    try {
      const request = await mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: "reinitto@gmail.com",
              Name: "Labais",
            },
            To: [
              {
                Email: email,
                Name: username,
              },
            ],
            Subject: `Greetings from Social-Newtork App, ${username} `,
            TextPart: "You just registered on the app with this email",
            HTMLPart: `<h3>Dear ${username}, welcome to <a href='https://www.mailjet.com/'>${appName}</a>!</h3><br />`,
            CustomID: "AppGettingStartedTest",
          },
        ],
      });
    } catch (err) {
      console.log("email err", err);
    }
  };

  router.post("/register", async (req, res) => {
    let { username, email, password } = req.body;
    let alreadyExists = await User.findOne({ email });
    if (alreadyExists) {
      res.status(400).json({ error: "email taken" });
    } else {
      let user = new User({
        username,
        email,
        password,
      });
      try {
        await user.save();
        passport.authenticate("local")(req, res, async () => {
          const {
            email,
            username,
            social_profiles,
            first_name,
            last_name,
            bio,
            cover_photo,
            profile_photo,
          } = req.user;
          await sendRegistrationEmail({ email, username });
          res.json({
            user: {
              email,
              username,
              social_profiles,
              first_name,
              last_name,
              bio,
              cover_photo,
              profile_photo,
            },
          });
        });
      } catch (err) {
        console.log("save err", err.message);
        res.status(400).json({ error: err.message });
      }
    }
  });

  router.post("/login", passport.authenticate("local"), (req, res) => {
    if (!req.user) {
      res.json({ user: null, error: "User not found" });
    }
    const {
      email,
      username,
      social_profiles,
      first_name,
      last_name,
      bio,
      cover_photo,
      profile_photo,
      id,
      friends,
    } = req.user;
    // calculate dm room ids
    const roomIds = res.json({
      user: {
        email,
        username,
        social_profiles,
        first_name,
        last_name,
        bio,
        cover_photo,
        profile_photo,
        id,
        friends,
      },
    });
  });

  router.get("/me", function (req, res) {
    if (!req.user) {
      res.json({ user: null, error: "User not found" });
    } else {
      const {
        email,
        username,
        social_profiles,
        first_name,
        last_name,
        bio,
        cover_photo,
        profile_photo,
        id,
        friends,
      } = req.user;
      res.json({
        user: {
          email,
          username,
          social_profiles,
          first_name,
          last_name,
          bio,
          cover_photo,
          profile_photo,
          id,
          friends,
        },
      });
    }
  });

  router.get("/logout", (req, res) => {
    req.session.destroy();
    res.status(200).send("logged out");
  });

  return router;
};
