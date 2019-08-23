const mongoose = require("mongoose");

const { Schema } = mongoose;

const bookmodel = new Schema({
  name: { type: String },
  author: { type: String },
  email: { type: String }
});

module.exports = mongoose.model('Book', bookmodel);