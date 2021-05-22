const mongoose = require('mongoose');

const VegitableSchema = mongoose.Schema({
    name: String,
    color: String,
    price: Number,

}, {
    timestamps: true // Mongoose uses this option to automatically add two new fields — createdAt and updatedAt to the schema.
});

module.exports = mongoose.model('Vegitable', VegitableSchema);