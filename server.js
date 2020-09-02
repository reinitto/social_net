require("dotenv").config({ path: ".env" });

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");
const auth = require("./routes/auth");
const user = require("./routes/user");
const post = require("./routes/post");
const friends = require("./routes/friends");
const chat = require("./routes/chat");
const initializePassport = require("./passport/passport-config");

// MIDDLEWARES
const logger = (req, res, next) => {
  console.log("req.session", req.session);
  console.log("req.user", req.user);
  return next();
};
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
};
////// END IMPORTS ////////////
const PORT = process.env.PORT || 5000;
initializePassport(passport);
const app = express();

//Configure our app
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "fraggle-rock",
    resave: true,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 30,
    },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
// app.use(logger);
app.use("/api/auth", auth(passport));
app.use("/api/user", isAuthenticated, user());
app.use("/api/post", isAuthenticated, post());
app.use("/api/friends", isAuthenticated, friends());
app.use("/api/chat", chat());
//Configure Mongoose
mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  () => {
    console.log("mongodb connected succesfully");
  }
);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "build")));

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
