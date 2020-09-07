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

// MIDDLEWARES ///
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

const sessionMiddleware = session({
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
});
const PORT = process.env.PORT || 5000;
initializePassport(passport);
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
//configure SOcket io
const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);
io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));
//Configure our app
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.set("socketio", io);
// app.use(logger);
app.use("/api/auth", auth(passport));
app.use("/api/user", isAuthenticated, user());
app.use("/api/post", isAuthenticated, post());
app.use("/api/friends", isAuthenticated, friends());
app.use("/api/chat", isAuthenticated, chat());
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

io.on("connection", (socket) => {
  console.log(`Connected: ${socket.id}`);
  io.of("/").clients((error, clients) => {
    if (error) throw error;
    console.log("clients", clients); // => [PZDoMHjiu8PYfRiKAAAF, Anw2LatarvGVVXEIAAAD]
  });
  socket.on("disconnect", () => console.log(`Disconnected: ${socket.id}`));
  socket.on("join", (room) => {
    console.log(`Socket ${socket.id} joining ${room}`);
    socket.join(room);
  });
  socket.on("leave", function (room) {
    console.log("leaving room", room);
    socket.leave(room);
  });
  // socket.on("chat", (data) => {
  //   const {
  //     username,
  //     first_name,
  //     last_name,
  //     profile_photo,
  //     id,
  //   } = socket.request.user;
  //   const { message, room } = data;
  //   console.log(`msg: ${message}, room: ${room}`);
  //   io.to(room).emit("chat", {
  //     content: message,
  //     sender: { username, first_name, last_name, profile_photo, id },
  //     created: Date.now(),
  //   });
  // });
});
// io.of("/admin").use(async (socket, next) => {
//   const user = await fetchUser(socket.handshake.query);
//   if (user.isAdmin) {
//     socket.user = user;
//     next();
//   } else {
//     next(new Error("forbidden"));
//   }
// });
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
