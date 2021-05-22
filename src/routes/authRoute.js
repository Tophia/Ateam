const User = require('../models/user.model');
var express = require('express');
var passport = require('passport');
var router = express.Router();
var authController = require('../controllers/auth.controllers')

router.post("/login", passport.authenticate("local") ,  authController.login)
router.post("/register", authController.register)

module.exports = router