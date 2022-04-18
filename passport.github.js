const passport = require("passport");
const GithubStrategy = require("passport-github").Strategy;

passport.use(
  "github",
  new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback",
  },
  function (accessToken, refreshToken, profile, done) {
    done(null, profile);
  }
));


passport.serializeUser((user, done) => {
   process.nextTick(function () {
    return done(null, { id: user.id, username: user.username, name: user.name });
   });
  done(null, user);
});
passport.deserializeUser(async (user, done) => {
  done(null, user);
});
