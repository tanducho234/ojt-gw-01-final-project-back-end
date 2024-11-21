// Require mongoose library
const mongoose = require("mongoose");

// Define size schema for product sizes
const sizeSchema = new mongoose.Schema(
  {
    // Size name/identifier
    size: {
      type: String,
      required: true,
    },
    // Price for this size
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    // Available quantity for this size
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

// Define color schema for product colors
const colorSchema = new mongoose.Schema(
  {
    // Color name
    color: {
      type: String,
      required: true,
    },
    // Array of sizes available for this color
    sizes: [sizeSchema],
    // Optional array of image URLs for this color
    imgLinks: {
      type: [String],
      required: false,
    },
  },
  { _id: false }
);

// Define main product schema
const productSchema = new mongoose.Schema(
  {
    generalImgLink: {
      type: String,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // Product gender category
    gender: {
      type: String,
      enum: ["male", "female", "unisex"],
      required: true,
    },
    // Reference to product category
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    // Reference to product style
    styleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Style",
      required: true,
    },
    // Reference to product brand
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    // Base price of product
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    // Optional sale discount percentage
    salePercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    // Product description
    description: {
      type: String,
      trim: true,
    },
    // Array of available colors and their details
    colors: [colorSchema],
    // Average product rating
    totalRating: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Total number of reviews
    totalReview: {
      type: Number,
      default: 0,
      min: 0,
    },
    soldQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
  
);

// Export the product model
module.exports = mongoose.model("Product", productSchema);

const datasample2 = {
  name: "Classic White T-Shirt",
  gender: "unisex",
  categoryId: "649d6ed5c71c9436f6bf5b07",
  styleId: "649d6ef1c71c9436f6bf5b09",
  brandId: "649d6f08c71c9436f6bf5b0b",
  price: 25,
  salePercentage: 10,
  description: "A simple, classic white T-shirt suitable for any occasion.",
  colors: [
    {
      color: "white",
      sizes: [
        {
          size: "S",
          price: 25,
          quantity: 50,
        },
        {
          size: "M",
          price: 25,
          quantity: 100,
        },
        {
          size: "L",
          price: 25,
          quantity: 75,
        },
      ],
      imgLinks: [
        "https://placehold.co/300?text=white-front",
        "https://placehold.co/300?text=white-back",
        "https://placehold.co/300?text=white-front",
      ],
    },
    {
      color: "black",
      sizes: [
        {
          size: "S",
          price: 25,
          quantity: 60,
        },
        {
          size: "M",
          price: 25,
          quantity: 110,
        },
        {
          size: "L",
          price: 25,
          quantity: 80,
        },
      ],
      imgLinks: [
        "https://placehold.co/300?text=black-front",
        "https://placehold.co/300?text=black-front",
        "https://placehold.co/300?text=black-behind",
      ],
    },
  ],
  totalRating: 4.5,
  totalReview: 120,
};
