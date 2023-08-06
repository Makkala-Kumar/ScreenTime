const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 4500;

require('dotenv').config();  

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(expressLayouts);
app.use(express.json());
app.use(cookieParser());

app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

//express-session middleware for login signups
app.use(session({
  secret: 'ScreenTimeProject',
  resave: true,
  saveUninitialized: true,
}));

// Middleware to set isLoggedIn variable
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn || false;
  next();
});

const routes = require('./server/routes/recipeRoutes.js');
app.use('/', routes);

app.listen(port, () => console.log(`Connected to port ${port}`));
