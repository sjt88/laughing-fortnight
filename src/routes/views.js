import express from 'express';
import _ from 'lodash';

var router = express.Router();
var charName = null;

function getUsername(req) {
  return _.get(req, 'session.passport.user.CharacterName', false);
}

router.get('/', function (req, res) {
  if (req.session.passport) {
    if (req.session.passport.user.CharacterName) {
      req.session.loggedIn = true;
    }
  } else {
    req.session.loggedIn = false;
  }

  res.render('partials/welcome', {
    username: getUsername(req),
    loggedIn: req.session.loggedIn
  });
});

router.get('/sso/fail', function (req, res) {
  res.render('partials/login_fail');
});

router.get('/session', function (req, res) {
  if (!req.session.loggedIn) {
    res.redirect(301, '/');
    return;
  }

  res.render('partials/session', {
    active: {session: true},
    session: JSON.stringify(req.session, null, 2),
    username: getUsername(req),
    loggedIn: req.session.loggedIn
  });
});

router.get('/profile', function (req, res) {
  if (!req.session.loggedIn) {
    console.log('---not logged in---');
    res.redirect(301, '/');
    return;
  }

  res.render('partials/profile', {
    active: {profile: true},
    charID: req.session.passport.user.CharacterID,
    charName: getUsername(req),
    username: getUsername(req),
    loggedIn: req.session.loggedIn
  });
});

router.get('/skills', function (req, res) {
  if (!req.session.loggedIn) {
    res.redirect(301, '/');
    return;
  }

  res.render('partials/skills', {
    active: {skills: true},
    username: getUsername(req),
    loggedIn: req.session.loggedIn
  });
});

router.get('/debug', function(req, res) {
  if (!req.session.loggedIn) {
    res.send(404);
    return;
  }
  if (getUsername(req) !== 'Tukao') return;

  res.render('partials/debug', {
  });
});

router.get('/login', function (req, res) {
  res.redirect('/api/sso');
});

router.get('/logout', function (req, res) {
  if (req.session.loggedIn) {
    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/');
      }
    });
  }
});

export default router;
