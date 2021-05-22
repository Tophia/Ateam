const express = require('express')
const router = express.Router()
const vegController = require('../controllers/vegitable.controllers');
// Retrieve all users
router.get('/', vegController.findAll);
// Create a new item
router.post('/', vegController.create);
// Retrieve a single user with id
router.get('/:id', vegController.findOne);
// Update a user with id
router.put('/:id', vegController.update);
// Delete a user with id
router.delete('/:id', vegController.delete);
module.exports = router