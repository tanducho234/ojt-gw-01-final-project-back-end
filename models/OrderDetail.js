const mongoose = require("mongoose");

// Define the OrderDetail schema
const orderDetailSchema = new mongoose.Schema(
  {
    // User ID associated with the order
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // List of products in the order
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        color: {
          type: String,
          required: true,
        },
        size: {
          type: String,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        imgLink: {
          type: String,
          required: true,
        },
        priceAtPurchase: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    // Current status of the order
    status: {
      type: String,
      enum: [
        "Pending",
        "Preparing",
        "Canceled",
        "Delivering",
        "Delivered",
        "Returned",
      ],
      required: true,
      default: "Pending",
    },
    // History of order status changes
    statusHistory: [
      {
        status: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        description: {
          type: String,
          trim: true,
        },
      },
    ],
    // Discount applied from voucher
    voucherDiscountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Cost of shipping
    shippingCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Total price after applying discounts and shipping
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    // Shipping address details
    shippingAddress: {
      recipientName: {
        type: String,
        required: true,
        trim: true,
      },
      phoneNumber: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
    },
    // Payment details
    paymentMethod: {
      type: String,
      enum: ["VNPAY", "Stripe", "COD"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    paymentLink: {
      type: String, // Stores the payment link for online payment methods
    },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderDetail", orderDetailSchema);
