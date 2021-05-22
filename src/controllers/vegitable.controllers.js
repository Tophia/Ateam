const Vegitable = require('../models/vegitable.model');
// Retrieve and return all Vegitables from the database.
exports.findAll = (req, res) => {
    Vegitable.find()
  .then(vegitables => {
  res.send(vegitables);
}).catch(err => {
  res.status(500).send({
  message: err.message || "Something went wrong while getting list of Vegitables."
});
});
};
// Create and Save a new Item
exports.create = (req, res) => {
// Validate request
if(!req.body) {
  return res.status(400).send({
  message: "Please fill all required field"
});
}
// Create a new Item
const vegitables = new Vegitable({
  name: req.body.name,
  color: req.body.color,
  price: req.body.price
});
// Save Item in the database
vegitables.save()
  .then(data => {
  res.send(data);
}).catch(err => {
  res.status(500).send({
  message: err.message || "Something went wrong while creating new Item."
});
});
};
// Find a single Item with a id
exports.findOne = (req, res) => {
 Vegitable.findById(req.params.id)
  .then(vegitables => {
  if(!vegitables) {
   return res.status(404).send({
   message: "vegitables not found with id " + req.params.id
 });
}
 res.send(vegitables);
}).catch(err => {
  if(err.kind === 'ObjectId') {
    return res.status(404).send({
    message: "Item not found with id " + req.params.id
  });
}
return res.status(500).send({
  message: "Error getting Item with id " + req.params.id
});
});
};
// Update a item identified by the id in the request
exports.update = (req, res) => {
// Validate Request
if(!req.body) {
  return res.status(400).send({
  message: "Please fill all required field"
});
}
// Find Item and update it with the request body
Vegitable.findByIdAndUpdate(req.params.id, {
  name: req.body.name,
  color: req.body.color,
  price: req.body.price
 
}, {new: true})
.then(vegitables => {
 if(!vegitables) {
   return res.status(404).send({
   message: "Item not found with id " + req.params.id
 });
}
res.send(vegitables);
}).catch(err => {
if(err.kind === 'ObjectId') {
  return res.status(404).send({
  message: "Item not found with id " + req.params.id
});
}
return res.status(500).send({
  message: "Error updating Item with id " + req.params.id
});
});
};
// Delete a Item with the specified id in the request
exports.delete = (req, res) => {
Vegitable.findByIdAndRemove(req.params.id)
.then(vegitables => {
if(!vegitables) {
  return res.status(404).send({
  message: "Item not found with id " + req.params.id
});
}
res.send({message: "item deleted successfully!"});
}).catch(err => {
if(err.kind === 'ObjectId' || err.name === 'NotFound') {
  return res.status(404).send({
  message: "Item not found with id " + req.params.id
});
}
return res.status(500).send({
  message: "Could not delete Item with id " + req.params.id
});
});
};