require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');

const app = express();

const port = process.env.PORT ? process.env.PORT : '3000';

require('./config/database');

const authController = require('./controllers/auth.js');
const gameCtrl = require('./controllers/game.js');

const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');
const isGameUser = require('./middleware/is-game-user.js');

app.use(morgan('dev'));

app.use(express.urlencoded({ extended: false }));

app.use(methodOverride('_method'));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE_URL
    })
  })
);

app.use(passUserToView);

app.use('/auth', authController);

app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/games', isSignedIn, gameCtrl.gameIndex);

app.get('/games/new', isSignedIn, gameCtrl.gameNew);

app.post('/games', isSignedIn, gameCtrl.gameCreate);

app.get('/games/:gameId', isSignedIn, isGameUser, gameCtrl.gameShow);

app.get('/games/:gameId/edit', isSignedIn, isGameUser, gameCtrl.gameEdit);

app.put('/games/:gameId', isSignedIn, isGameUser, gameCtrl.gameUpdate);

app.delete('/games/:gameId', isSignedIn, isGameUser, gameCtrl.gameDelete);

app.listen(port);