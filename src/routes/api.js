import express from 'express';
import path from 'path';
import passport from 'passport';
import EveOnlineStrategy from 'passport-eveonline';
import secrets from '../../conf/SSO.json';

var router = express.Router();

var eveonlineSSO = new EveOnlineStrategy({
  "clientID": secrets.eveSSO.clientID,
  "clientSecret": secrets.eveSSO.clientSecret,
  "callbackURL": "http://localhost:3000/api/sso/cb",
  "scope": secrets.eveSSO.scopes.join(' ')
}, (access, refresh, charInfo, done) => {
  charInfo.access = access;
  done(null, charInfo);
});

passport.use(eveonlineSSO);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

router.get('/sso', passport.authenticate('eveonline'));
router.get('/sso/cb', passport.authenticate('eveonline', {
  successRedirect: '/',
  failureRedirect: '/sso/fail'
}));

export default router;
