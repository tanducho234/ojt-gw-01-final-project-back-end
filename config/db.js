const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Voucher = require("../models/Voucher");

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB using Mongoose
const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      autoSelectFamily: false,
    });
    console.log("Connected to MongoDB with Mongoose");
    // await createExampleVouchers()
    
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

const createExampleVouchers = async () => {

  // Create some example voucher documents
  const vouchers = [
    {
      code: "WELCOME10",
      type: "public",
      discountAmount: 0,  // discountAmount is 0, so discountPercentage will apply
      discountPercentage: 10,
      minOrderValue: 50,
      expirationDate: new Date("2024-12-31"),
    },
    {
      code: "BLACKFRIDAY50",
      type: "restricted",
      discountAmount: 50,
      discountPercentage: 0, // discountPercentage is 0, so discountAmount will apply
      minOrderValue: 100,
      maxUsage: 500,
      expirationDate: new Date("2024-11-29"),
    },
    {
      code: "NEWYEAR2024",
      type: "restricted",
      discountAmount: 0,
      discountPercentage: 20,
      minOrderValue: 75,
      maxUsage: 100,
      expirationDate: new Date("2024-01-01"),
    },
    {
      code: "SUMMER30",
      type: "public",
      discountAmount: 0,
      discountPercentage: 30,
      minOrderValue: 25,
      expirationDate: null,  // No expiration
    },
  ];

  try {
    // Insert vouchers into the database
    await Voucher.insertMany(vouchers);
    console.log("Example vouchers added successfully!");
  } catch (error) {
    console.error("Error inserting vouchers:", error);
  } 
};

module.exports = connectToDatabase;
