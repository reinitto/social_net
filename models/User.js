var mongoose = require("mongoose");
var validator = require("validator");
var bcrypt = require("bcrypt");
var Schema = mongoose.Schema;
var SALT_WORK_FACTOR = 10;
const { isEmail } = validator;
var UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: [6, "Username must be at least 6 characters long"],
    maxlength: [100, "Username must be less than 100 characters long"],
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    index: { unique: [true, "Email already in use"] },
    validate: {
      validator: (email) => isEmail(email),
    },
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Invalid password"],
    maxlength: [255, "Invalid password"],
  },
  first_name: { type: String },
  last_name: { type: String },
  profile_photo: { type: String },
  cover_photo: { type: String },
  bio: { type: String },
  social_profiles: {
    type: "mixed",
    default: { facebook: "", instagram: "", twitter: "" },
  },
  interests: { type: [String] },
  created: { type: Date, default: Date.now },
});

UserSchema.pre("save", function (next) {
  var user = this;
  if (!user.isModified("password")) return next();
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);
