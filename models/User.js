const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    recipientName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    birthDate: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    address: {
      type: String,
      trim: true,
    },
    reviews: [reviewSchema],
    addresses: [addressSchema],
  },
  { timestamps: true }
);
//function to add new review to user
userSchema.methods.addReview = function (review) {
  this.reviews.push(review);
  return this.save();
};

module.exports = mongoose.model("User", userSchema);




const user1 = {
  email: "johndoe@example.com",
  password: "securePassword123", // In practice, you would hash the password before saving
  fullName: "John Doe",
  phoneNumber: "123-456-7890",
  gender: "male",
  birthDate: new Date("1990-01-15"),
  role: "user",
  address: "123 Main St, Springfield, IL",
  reviews: [
    {
      productId: "60b8d295f1d12d0069eae8c7", // Assuming this is a valid Product ID
      rating: 5,
      comment: "Great product! Would definitely recommend.",
    },
  ],
  addresses: [
    {
      recipientName: "John Doe",
      phoneNumber: "123-456-7890",
      address: "123 Main St, Springfield, IL",
    },
  ],
};

// Sample 2: An admin user with multiple addresses and reviews
const user2 = {
  email: "janedoe@example.com",
  password: "anotherSecurePassword456", // Remember to hash passwords in real applications
  fullName: "Jane Doe",
  phoneNumber: "987-654-3210",
  gender: "female",
  birthDate: new Date("1985-08-22"),
  role: "admin",
  address: "456 Oak Rd, Metropolis, NY",
  reviews: [
    {
      productId: "60b8d295f1d12d0069eae8c8", // Another valid Product ID
      rating: 4,
      comment: "Good quality, but it took a little longer to ship.",
    },
    {
      productId: "60b8d295f1d12d0069eae8c9", // Yet another valid Product ID
      rating: 3,
      comment: "Average product. Nothing special.",
    },
  ],
  addresses: [
    {
      recipientName: "Jane Doe",
      phoneNumber: "987-654-3210",
      address: "456 Oak Rd, Metropolis, NY",
    },
    {
      recipientName: "Jane Doe",
      phoneNumber: "987-654-3210",
      address: "789 Pine St, Gotham, NY",
    },
  ],
};