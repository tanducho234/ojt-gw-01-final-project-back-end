const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema(
  {
    size: {
      enum: ["S", "M", "L", "XL"],
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const colorSchema = new mongoose.Schema(
  {
    //example: Red
    color: {
      type: String,
      required: true,
      enum: [
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
    sizes: [sizeSchema],
    //example: https://placehold.co/300x300/ebb734/white?text=Red+T-Shirt+1+Front
    //https://placehold.co/300x300/ff0000/white?text=Red+T-Shirt+1+Back
    //https://placehold.co/300x300/ff0000/white?text=Red+T-Shirt+1+Side
    imgLinks: {
      type: [String],
      required: false,
    },
  },
  { _id: false }
);
//clothes shop
const productSchema = new mongoose.Schema(
  {
    //example: Men's Casual T-Shirt
    name: {
      type: String,
      required: true,
      trim: true,
    },
    //example: https://placehold.co/300x300/000000/white?text=Men%27s+Casual+T-Shirt : black background
    generalImgLink: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female", "unisex"],
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    styleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Style",
      required: true,
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    salePercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    //a very long(10 lines) multiple line \n 
    description: {
      type: String,
      trim: true,
    },
    colors: [colorSchema],
    totalRating: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalReview: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
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

module.exports = mongoose.model("Product", productSchema);
