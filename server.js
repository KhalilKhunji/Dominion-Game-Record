// Import Modules
require('dotenv').config();
const express = require('express');
require('./config/database');
const morgan = require('morgan');
const methodOverride = require('method-override');
const authController = require('./controllers/auth.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

const app = express();

const port = process.env.PORT ? process.env.PORT : "3000";

// Middleware
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
app.use("/auth", authController);

app.get("/", (req, res) => {
  const user = req.session.user;  
  res.render("index.ejs");
});

app.get("/vip-lounge", isSignedIn, (req, res) => {
  res.send(`Welcome to the party ${req.session.user.username}.`);
});



// Port Listening
app.listen(3000, () => {
  console.log('Listening on port 3000');
});