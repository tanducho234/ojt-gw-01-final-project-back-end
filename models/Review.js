const mongoose = require('mongoose');

// Define review schema
const reviewSchema = new mongoose.Schema({
  // User who wrote the review
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Product being reviewed
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  // Date of the review
  date: {
    type: Date,
    default: Date.now,
  },
  // Rating (0-5, allows decimals)
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  // Feedback content
  feedback: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model('Review', reviewSchema);
