const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  color: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  priceAtPurchase: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
}, { _id: false });

const trackingSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
}, { _id: false });

const orderDetailSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [productSchema],
  orderStatus: {
    type: String,
    enum: ['pending', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  trackingHistory: [trackingSchema],
  shippingCost: {
    type: Number,
    required: true,
    min: 0
  },
  voucherDiscount: {
    type: Number,
    default: 0,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal', 'cash_on_delivery', 'bank_transfer'],
    required: true
  },
  finalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  shippingAddress: {
    recipientName: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('OrderDetail', orderDetailSchema);


const order1 = new OrderDetail({
    userId: "60b8d295f1d12d0069eae8c7", // assuming this is a valid User ID
    products: [
      {
        productId: "60b8d295f1d12d0069eae8c7", // valid Product ID
        color: "Red",
        size: "M",
        priceAtPurchase: 150,
        quantity: 2,
      },
      {
        productId: "60b8d295f1d12d0069eae8c8", // another valid Product ID
        color: "Black",
        size: "L",
        priceAtPurchase: 120,
        quantity: 1,
      },
    ],
    orderStatus: "shipped",
    trackingHistory: [
      {
        status: "Order Placed",
        date: new Date("2024-11-10"),
      },
      {
        status: "Shipped",
        date: new Date("2024-11-12"),
      },
      {
        status: "Out for Delivery",
        date: new Date("2024-11-14"),
      },
    ],
    shippingCost: 15,
    voucherDiscount: 10,
    paymentMethod: "credit_card",
    finalAmount: 375, // (150*2) + 120 + 15 - 10
    shippingAddress: {
      recipientName: "John Doe",
      phoneNumber: "123-456-7890",
      address: "123 Main St, Springfield, IL",
    },
  });
  
  // Sample 2: Order with single product and payment via PayPal
  const order2 = new OrderDetail({
    userId: "60b8d295f1d12d0069eae8c9", // assuming this is a valid User ID
    products: [
      {
        productId: "60b8d295f1d12d0069eae8c9", // valid Product ID
        color: "Blue",
        size: "XL",
        priceAtPurchase: 200,
        quantity: 1,
      },
    ],
    orderStatus: "delivered",
    trackingHistory: [
      {
        status: "Order Placed",
        date: new Date("2024-11-08"),
      },
      {
        status: "Shipped",
        date: new Date("2024-11-09"),
      },
      {
        status: "Delivered",
        date: new Date("2024-11-11"),
      },
    ],
    shippingCost: 20,
    voucherDiscount: 0,
    paymentMethod: "paypal",
    finalAmount: 220, // 200 + 20 (shipping cost)
    shippingAddress: {
      recipientName: "Jane Doe",
      phoneNumber: "987-654-3210",
      address: "456 Oak Rd, Metropolis, NY",
    },
  });