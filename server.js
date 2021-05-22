const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
authRoute = require("./src/routes/authRoute"),
  postRoute = require("./src/routes/postRoute"),
  auth = require('./src/middleware/auth')(),
  User = require("./src/models/user.model"),
  passport = require("passport"),
  localStrategy = require("passport-local"),
  require("dotenv").config();
  ////////////////////////////////////////
// require("dotenv").config({
//   path: path.join(__dirname, "../.env")
//  });
  
// create express app
  app = express();
// Setup server port
const port = process.env.PORT || 4000;
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())
// Configuring the database
const dbConfig = require('./config/db.config.js');
const mongoose = require('mongoose');
//passport---//
// mongoose.connect("mongodb://localhost/Ateam", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
////////////////////////======
//  const app = express();
  
//  const PORT = process.env.PORT || 3000;
  
 mongoose
  .connect('mongodb://localhost:27017/Ateam')
  .then(() => {
   console.log('Connected to the Database successfully');
  });
  
 app.use(bodyParser.urlencoded({ extended: true }));
  
 app.use(async (req, res, next) => {
  if (req.headers["x-access-token"]) {
   const accessToken = req.headers["x-access-token"];
   const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
   // Check if token has expired
   if (exp < Date.now().valueOf() / 1000) { 
    return res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" });
   } 
   res.locals.loggedInUser = await User.findById(userId); next(); 
  } else { 
   next(); 
  } 
 });
 //////////////////////////////////////////////////////////
////-----/////
// mongoose.Promise = global.Promise;
// Connecting to the database
// mongoose.connect(dbConfig.url, {
// useNewUrlParser: true,
// // useUnifiedTopology: true,
// }).then(() => {
//   console.log("Successfully connected to the database");
// }).catch(err => {
//   console.log('Could not connect to the database.', err);
//   process.exit();
// });
// passport-------------//
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(auth.initialize());
// Passport Config
passport.use(new localStrategy(User.authenticate()));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

///------------///
// Require Users routes
const userRoutes = require('./src/routes/user.routes')
const vegRoutes = require('./src/routes/vegitable.routes')
// using as middleware
app.use('/api/users', userRoutes)
app.use('/api/vegitables', vegRoutes)
///passport ///
app.use(authRoute);
app.use(postRoute);
///----///
//app.use('/', routes);
// listen for requests
app.listen(port, () => {
   console.log(`Node server is listening on port ${port}`);
});