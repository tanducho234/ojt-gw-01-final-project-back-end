const crypto = require("crypto");
const qs = require("qs");
require("dotenv").config(); // Load .env file
const moment = require("moment");

function createVnPayCheckoutSession(amount, bankCode, orderId) {
  // Set time zone
  process.env.TZ = "Asia/Ho_Chi_Minh";

  let date = new Date();
  let createDate = moment(date).format("YYYYMMDDHHmmss");

  // Get IP address from the request
  let ipAddr = "127.0.0.1"; // Placeholder, replace with actual IP address in your implementation

  // Get config from environment variables
  let tmnCode = process.env.VNP_TMN_CODE;
  let secretKey = process.env.VNP_HASH_SECRET;
  let vnpUrl = process.env.VNP_URL;
  let returnUrl = `${process.env.VNP_RETURN_URL}/${orderId}`;
  let locale = "en"; // Default locale
  let currCode = "VND"; // Default currency

  // Build VNP parameters
  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: currCode,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderId,
    vnp_OrderType: "other",
    vnp_Amount: amount * 100, // Convert amount to the smallest unit (VND)
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  if (bankCode) {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);
  console.log("vnp_Params", vnp_Params);

  // Create the signature
  let signData = qs.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  // Add signature to the parameters
  vnp_Params["vnp_SecureHash"] = signed;

  // Build the full URL
  vnpUrl += "?" + qs.stringify(vnp_Params, { encode: false });

  return vnpUrl;
}

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

module.exports = { createVnPayCheckoutSession };
