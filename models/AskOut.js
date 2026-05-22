const mongoose = require('mongoose');

const askOutSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  gifUrl: {
    type: String,
  },
  yesLabel: {
    type: String,
  },
  noLabel: {
    type: String,
  },
  yesTitle: {
    type: String,
  },
  yesSubtext: {
    type: String,
  },
  yesImageUrl: {
    type: String,
  },
  backgroundColor: {
    type: String,
  },
  yesBtnColor: {
    type: String,
    default: '#ff6fa5',
  },
  noBtnColor: {
    type: String,
    default: '#f0c0d0',
  },
  celebrationEmojis: {
    type: [String],
  },
});

const AskOut = mongoose.model('AskOut', askOutSchema);
module.exports = AskOut;
