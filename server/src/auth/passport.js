import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from '../resources/user/user.model';

export const passportAuthenticate = async (req, res, next) => {
  try {
    await passport.authenticate('local', { failureRedirect: '/error' })(req, res, next);
  } catch (err) {
    return res.status(401).json({ message: 'Error in passportAuthenticate middleware.' });
  }
};

export function passportAuth() {
  passport.serializeUser((user, cb) => {
    cb(null, user);
  });
  passport.deserializeUser((id, cb) => {
    User.findById(id, (err, user) => {
      cb(err, user);
    });
  });
}

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username }).exec();
      if (!user) {
        return done(null, false, { message: 'LocalStrategy !user' });
      }
      const match = await user.checkPassword(password);
      if (!match) {
        return done(null, false, { message: 'LocalStrategy Invalid Password.' });
      }
      if (match) {
        return done(null, user, { message: 'You may pass...' });
      }
    } catch (err) {
      return err;
    }
  },

));

export const ensureAuth = async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({ message: 'Not Authenticated.' });
  } catch (err) {
    return res.status(401).json({ message: 'Error in ensureAuth middleware.' });
  }
};
