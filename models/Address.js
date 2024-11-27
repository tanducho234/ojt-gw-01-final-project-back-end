const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
  recipientName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
}, { timestamps: true }); // Timestamps for createdAt and updatedAt

module.exports = mongoose.model('Address', addressSchema);
