const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const getUserByEmail = (email) => User.findOne({ email });
const getUserById = (id) => User.findById(id);

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    const user = await getUserByEmail(email);
    if (!user) {
      return done(null, false, { message: "No user Found" });
    }
    try {
      user.comparePassword(password, function (err, isMatch) {
        if (err) {
          return done(err);
        } else if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "wrong password" });
        }
      });
    } catch (err) {
      return done(err);
    }
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => {
    return done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    let user = await getUserById(id);
    return done(null, user);
  });
}

module.exports = initialize;
