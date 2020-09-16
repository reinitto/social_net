const User = require("../models/User");
const Friends = require("../models/Friends");
const express = require("express");
const { appName } = require("../client/src/constants.js");
const router = express.Router();

const mailjet = require("node-mailjet").connect(
  process.env.MAILJET_API,
  process.env.MAILJET_SECRET
);
const getUserFriends = async (friendshipIds) => {
  const friendships = await Friends.find({
    _id: { $in: friendshipIds },
  }).populate({
    path: "recipient",
    model: "User",
  });
  return friendships;
};
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
// Destructures user from req.user object
const destructureUser = async (userObj) => {
  const {
    email = "",
    username = "",
    social_profiles = { facebook: "", instagram: "", twitter: "" },
    first_name = "",
    last_name = "",
    bio = "",
    cover_photo = "",
    profile_photo = "",
    id = "",
    friends = [],
  } = userObj;
  const friendshipIds = friends.map((friend) => friend._id);
  const friendships = await getUserFriends(friendshipIds);
  return {
    email,
    username,
    social_profiles,
    first_name,
    last_name,
    bio,
    cover_photo,
    profile_photo,
    id,
    friends: friendships,
  };
};

module.exports = function (passport) {
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
          await sendRegistrationEmail({ email, username });
          const user = await destructureUser(req.user);
          res.json({
            user,
          });
        });
      } catch (err) {
        console.log("save err", err.message);
        res.status(400).json({ error: err.message });
      }
    }
  });

  router.post("/login", passport.authenticate("local"), async (req, res) => {
    if (!req.user) {
      res.json({ user: null, error: "User not found" });
    }
    const user = await destructureUser(req.user);
    res.json({
      user,
    });
  });

  router.get("/me", async (req, res) => {
    if (!req.user) {
      res.json({ user: null, error: "User not found" });
    } else {
      const user = await destructureUser(req.user);
      res.json({
        user,
      });
    }
  });

  router.get("/logout", (req, res) => {
    req.session.destroy();
    res.status(200).send("logged out");
  });

  return router;
};
