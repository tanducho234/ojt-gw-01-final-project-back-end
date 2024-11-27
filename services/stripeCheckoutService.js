// services/stripeCheckoutService.js
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_KEY);

async function createStripeCheckoutSession(
  userId,
  orderDetailId,
  cartItems,
  voucherDiscountAmount,
  shippingMethod,
//   shippingAddress,
) {
  console.log("userId", userId);
  console.log("orderDetailId", orderDetailId);
  console.log("cartItems", cartItems);
  console.log("voucherDiscountAmount", voucherDiscountAmount);
  console.log("shippingMethod", shippingMethod);
  // const orderValue = cartItems.reduce(
  //   (total, item) => total + item.price * item.quantity,
  //   0
  // );

  // Validate shipping method
  
  const shippingOptions = {
    economy: 200,
    standard: 350,
    express: 500,
  };
  const shippingCost =
    shippingOptions[shippingMethod] || shippingOptions.standard;
  console.log("shippingCost", shippingCost,"voucherDiscountAmount",voucherDiscountAmount);
  // Validate voucher
  let coupon;
  coupon = await stripe.coupons.create({
    amount_off: voucherDiscountAmount * 100,
    currency: "usd",
    duration: "once",
  });
  console.log("coupon", coupon);

  //   if (voucher) {
  //     if (voucher.type === "percentage") {
  //       coupon = await stripe.coupons.create({
  //         percent_off: voucher.value,
  //         duration: "once",
  //       });
  //     } else if (voucher.type === "fixed") {
  //       coupon = await stripe.coupons.create({
  //         amount_off: voucher.value * 100,
  //         currency: "usd",
  //         duration: "once",
  //       });
  //     }
  //   }

  const customer = await stripe.customers.create({
    metadata: {
      userId,
      orderDetailId,
    //   shippingAddress: JSON.stringify(shippingAddress),
    //   voucher: JSON.stringify(voucher),
    //   shippingMethod,
    //   ...cartItems.reduce((metadata, item, index) => {
    //     const { imgLink, ...rest } = item;
    //     metadata[`product${index + 1}`] = JSON.stringify(rest);
    //     return metadata;
    //   }, {}),
    },
  });
  console.log("customer", customer);
  const line_items = cartItems.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: `${item.name} (${item.color}, ${item.size})`,
        images: [item.imgLink],
      },
      unit_amount: item.priceAtPurchase * 100,
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: shippingCost,
            currency: "usd",
          },
          display_name:
            shippingMethod.charAt(0).toUpperCase() + shippingMethod.slice(1),
        },
      },
    ],
    line_items,
    mode: "payment",
    customer: customer.id,
    discounts: coupon ? [{ coupon: coupon.id }] : [],
    success_url: `${process.env.CLIENT_URL}/checkout-success`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
    locale: "en",
  });

  return session.url;
}

module.exports = { createStripeCheckoutSession };
