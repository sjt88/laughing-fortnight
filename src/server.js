import path from 'path';
import express from 'express';
import Handlebars from 'express-handlebars';
import session from 'express-session';
import passport from 'passport';
import * as helpers from './helpers';
import routes from './routes';

import _install from 'source-map-support';
_install.install();

var hbs = Handlebars.create({
  extname: 'handlebars',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, '..', './views/layouts'),
  partialsDir: path.join(__dirname, '..', './views/partials'),
  helpers: {
    compare: helpers.comparison
  }
});

var app = express();

app.engine('handlebars', hbs.engine);
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'handlebars');

app.use(session({
  secret: 'somesecret',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.listen(3000);
