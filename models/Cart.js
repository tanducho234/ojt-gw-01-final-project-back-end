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
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [productSchema] // Mảng chứa các sản phẩm trong giỏ hàng
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);




const cart1 = new Cart({
    userId: "60b8d295f1d12d0069eae8c7", // assuming this is a valid User ID
    products: [
      {
        productId: "60b8d295f1d12d0069eae8c7", // valid Product ID (Product 1)
        color: "Red", // variant with color Red
        size: "M", // variant with size M
        quantity: 2,
      },
      {
        productId: "60b8d295f1d12d0069eae8c7", // valid Product ID (Product 1) again
        color: "Blue", // variant with color Blue
        size: "L", // variant with size L
        quantity: 1,
      },
      {
        productId: "60b8d295f1d12d0069eae8c7", // valid Product ID (Product 1) again
        color: "Black", // variant with color Black
        size: "S", // variant with size S
        quantity: 3,
      },
    ],
  });
  
  // Sample Cart for another user with similar variations for the same product
  const cart2 = new Cart({
    userId: "60b8d295f1d12d0069eae8c9", // assuming this is a valid User ID
    products: [
      {
        productId: "60b8d295f1d12d0069eae8c9", // valid Product ID (Product 2)
        color: "Green", // variant with color Green
        size: "M", // variant with size M
        quantity: 1,
      },
      {
        productId: "60b8d295f1d12d0069eae8c9", // valid Product ID (Product 2)
        color: "Yellow", // variant with color Yellow
        size: "L", // variant with size L
        quantity: 2,
      },
    ],
  });