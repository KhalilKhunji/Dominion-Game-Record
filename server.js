// Import Modules
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();

const port = process.env.PORT ? process.env.PORT : '3000';

// Database (Maybe models unnecessary here?)
require('./config/database');
const Game = require('./models/game.js');
const Card = require('./models/card.js');

// Controllers
const authController = require('./controllers/auth.js');
const gameCtrl = require('./controllers/game.js');

// Middleware (Maybe signin MW above AuthCtrl require?)
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

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

// Routes
app.use('/auth', authController);

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/games', isSignedIn, gameCtrl.gameIndex);

app.get('/games/new', isSignedIn, gameCtrl.gameNew);

app.post('/games', isSignedIn, gameCtrl.gameCreate);

app.get('/games/:gameId', isSignedIn, gameCtrl.gameShow);

app.get('/games/:gameId/edit', isSignedIn, gameCtrl.gameEdit);

app.put('/games/:gameId', isSignedIn, gameCtrl.gameUpdate);

app.delete('/games/:gameId', isSignedIn, gameCtrl.gameDelete);

// Port Listening
app.listen(3000, () => {
  console.log('Listening on port 3000');
});