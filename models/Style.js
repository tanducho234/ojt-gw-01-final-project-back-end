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
  },
  imgLink: {
    type: String,
  },
});

const Style = mongoose.model("Style", styleSchema);

module.exports = Style;
