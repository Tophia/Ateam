const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controllers');
const vegController = require('../controllers/vegitable.controllers');
// // Retrieve all users
// router.get('/', userController.findAll);
// // Create a new user
// router.post('/', userController.create);
// // Retrieve a single user with id
// router.get('/:id', userController.findOne);
// // Update a user with id
// router.put('/:id', userController.update);
// // Delete a user with id
// router.delete('/:id', userController.delete);
/////////////////////////////////////////////////////////////////////////
router.post('/signup', userController.signup);
 
router.post('/login', userController.login);
 
router.get('/:userId', userController.allowIfLoggedin, userController.getUser);
 
router.get('/', userController.allowIfLoggedin, userController.grantAccess('readAny'), userController.getUsers);
 
router.put('/:userId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'profile'), userController.updateUser);
 
router.delete('/:userId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'profile'), userController.deleteUser);
module.exports = router