const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").Strategy;

passport.use(
  "google",
  new GoogleStrategy({
    consumerKey: process.env.GOOGLE_CLIENT_ID,
    consumerSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
  },
  function (accessToken, refreshToken, profile, done) {
    console.log(accessToken, refreshToken, profile);
    done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  process.nextTick(function() {
    done(null, { id: user.id, username: user.username, name: user.name });
  });
  // done(null, user);
});
passport.deserializeUser(async (user, done) => {
  done(null, user);
});

