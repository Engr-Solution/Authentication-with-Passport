const passport = require("passport");
const LocalStategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const initialize = (passport, getUserByEmail, getUserById) => {
  const authUser = async (email, password, done) => {
    const user = await getUserByEmail(email);
    if (user == null)
      return done(null, false, {
        message: `No user with the email '${email}' found`,
      });

    try {
      if (await bcrypt.compare(password, user.password)) {
        done(null, user);
      } else {
        done(null, false, { message: "Password Incorrect" });
      }
    } catch (err) {
      done(err);
    }
  };

  passport.use('local', new LocalStategy({ usernameField: "email" }, authUser));


  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser(async (id, done) => {
    done(null, await getUserById(id));
  });
}; 


module.exports = initialize;
