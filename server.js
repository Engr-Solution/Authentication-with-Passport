const express = require("express");
const bodyparser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const flash = require("express-flash");
const env = require("dotenv").config({ path: "./.env" });
const path = require("path");

const connectDB = require("./server/database/dbconnection");
const user = require("./server/model/model");
const routes = require("./server/routes/routes");
const initializePassport = require("./passport.local");
const initializeGoogle = require('./passport.google');
const initializeGithub = require('./passport.github');

const app = express();
const _port = process.env.PORT || 3000;

// Execute DB connection
connectDB();

initializePassport(
  passport,
  async (email) => {
    const foundUser = await user.findOne({ email });
    return foundUser;
  },
  async (id) => {
    const foundUser = await user.findOne({ _id: id });
    return foundUser;
  }
);

// Middlewares
app.set("view engine", "ejs"); // Set View Engine
app.use(express.static("assets"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/", routes); // Routes

app.listen(_port, () => console.log(`App listening on port ${_port}`));
