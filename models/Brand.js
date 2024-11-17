//models/brand.js
const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
  },
  imgLink: {
    type: String,
  },
});
const Brand = mongoose.model('Brand', brandSchema);
module.exports = Brand;