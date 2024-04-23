import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import express from 'express';
import User from '../models/User.model';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const router = express.Router();

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_SECRET_KEY,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const user = await User.findOne({
          accountId: profile.id,
          provider: 'github',
        });

        if (!user) {
          console.log('Adding new GitHub user to DB..');
          const newUser = new User({
            accountId: profile.id,
            name: profile.username,
            provider: profile.provider,
          });
          await newUser.save();
          return cb(null, profile);
        } else {
          console.log('GitHub user already exists in DB..');
          return cb(null, profile);
        }
      } catch (error) {
        return cb(error);
      }
    }
  )
);

router.get('/', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/callback',
  passport.authenticate('github', { failureRedirect: '/auth/github/error' }),
  (req, res) => {
    res.redirect('/auth/github/success');
  }
);

router.get('/success', (req, res) => {
  const userInfo = {
    id: req.session.passport.user.id,
    displayName: req.session.passport.user.username,
    provider: req.session.passport.user.provider,
  };
  res.render('fb-github-success', { user: userInfo });
});

router.get('/error', (req, res) => res.send('Error logging in via GitHub..'));

router.get('/signout', (req, res) => {
  try {
    req.session.destroy(function (err) {
      console.log('session destroyed.');
    });
    res.render('auth');
  } catch (err) {
    res.status(400).send({ message: 'Failed to sign out GitHub user' });
  }
});

export default router;
