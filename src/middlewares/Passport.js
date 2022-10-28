var GoogleStrategy = require("passport-google-oauth2").Strategy;

const passport = require('passport')

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_OAUTH2_CLIENT_ID,
        clientSecret: process.env.GOOGLE_OAUTH2_CLIENT_SECRET,
        callbackURL: `${process.env.CALLBACK_URL_BACK_END}users/auth/google/callback`,
        passReqToCallback: true,
        store  : false
      },
      async (request, accessToken, refreshToken, profile, done) => {
        try {
          return done(null, JSON.stringify(profile));
        } catch (error) {
          return done(error, false);
        }
      }
    )
  )
