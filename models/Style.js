//model/Style.js
const mongoose = require("mongoose");

const styleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  imgLink: {
    type: String,
    required: true,
  },
});

const Style = mongoose.model("Style", styleSchema);

module.exports = Style;
