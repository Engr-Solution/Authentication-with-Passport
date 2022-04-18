const express = require("express");
const Router = express.Router();
const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../model/model");
const { checkAuth, checkNotAuth } = require("../middlewares/auth");

Router.get("/", checkAuth, (req, res) => {
  res.render("index", { user: req.user });
});

Router.get("/register", checkNotAuth, (req, res) => {
  res.render("register");
});

Router.get("/login", checkNotAuth, (req, res) => {
  res.render("login");
});

Router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

Router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successReturnToOrRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

Router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["profile"] })
);

Router.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    successReturnToOrRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

Router.post(
  "/auth/login",
  checkNotAuth,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

Router.post("/auth/register", checkNotAuth, async (req, res) => {
  const existUser = await User.findOne({ email: req.body.email });
  if (existUser) {
    req.flash("error", "User with the email already exist");
    res.redirect("/register");
  } else {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = new User({
        firstname: req.body.fname,
        lastname: req.body.lname,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });
      await user.save();
      res.redirect("/login");
    } catch (err) {
      req.flash("error", err);
      console.log(err);
      res.redirect("/register");
    }
  }
});

Router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

module.exports = Router;
