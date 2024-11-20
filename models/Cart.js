const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  products: [
    {
      productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
      },
      color: { 
        type: String, 
        required: true , enum: [
          "Green",
          "Red",
          "Yellow",
          "Orange",
          "Blue",
          "Purple",
          "Pink",
          "White",
          "Black",
          "Brown",
          "Gray",
          "HotPink",
        ],
      },
      size: { 
        type: String, 
        required: true,
        enum: ["S", "M", "L", "XL"], 
      },
      quantity: { 
        type: Number, 
        required: true,
        min: 1 
      }
    }
  ]
}, {
  timestamps: true
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
