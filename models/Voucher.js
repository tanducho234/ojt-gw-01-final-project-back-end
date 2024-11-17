const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  type: {
    type: String,
    enum: ['public', 'restricted'],
    required: true
  },
  discountAmount: {
    type: Number,
    required: true,
    min: 0
  },
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100
  },
  minOrderValue: {
    type: Number,
    default: 0,
    min: 0
  },
  maxUsage: {
    type: Number,
    default: null // Only applicable for restricted vouchers
  },
  usageCount: {
    type: Number,
    default: 0
  },
  expirationDate: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Function to check if a voucher can be used
voucherSchema.methods.canBeUsed = function() {
  if (!this.isActive || (this.expirationDate && this.expirationDate < new Date())) {
    return false;
  }
  if (this.type === 'restricted' && this.maxUsage !== null && this.usageCount >= this.maxUsage) {
    return false;
  }
  return true;
};

module.exports = mongoose.model('Voucher', voucherSchema);
