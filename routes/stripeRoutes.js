const express = require("express");
const Stripe = require("stripe");

require("dotenv").config();

const stripe = Stripe(process.env.STRIPE_KEY);

const router = express.Router();

router.post("/create-checkout-session", async (req, res) => {
    try{
  const { userId, cartItems, voucher, shippingMethod, shippingAddress } =
    req.body;

  // Validate shipping method
  const shippingOptions = {
    economy: 200, // $2
    standard: 350, // $3.5
    express: 500, // $5
  };
  const shippingCost =
    shippingOptions[shippingMethod] || shippingOptions.standard;

  // Validate voucher (replace this with your actual voucher validation logic)
  let coupon
  if (voucher) {
    // Simulate voucher application
    if (voucher.type === "percentage") {
         coupon = await stripe.coupons.create({
            percent_off: voucher.value,
            duration: "once",
          });
    } else if (voucher.type === "fixed") {
         coupon = await stripe.coupons.create({
            amount_off: voucher.value * 100,
            currency: "usd",
            duration: "once",
          });
     
    }
  }

  const customer = await stripe.customers.create({
    metadata: {
      userId,
      cart: JSON.stringify(
        cartItems.map((item) => {
          const { imgLink, ...rest } = item;
          return rest;
        })
      ),
      shippingAddress: JSON.stringify(shippingAddress),
      voucher: JSON.stringify(voucher),
      shippingMethod,
    },
  });

  const line_items = cartItems.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: `${item.name} (${item.color}, ${item.size})`,
        images: [item.imgLink],
        // metadata: {
        //   productId: item.productId,
        //   color: item.color,
        //   size: item.size,
        // },
      },
      unit_amount: item.price * 100,
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
    discounts: [{ coupon: coupon.id }],
    success_url: `${process.env.CLIENT_URL}/checkout-success`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
    locale
      : "en",
  });

  res.send({ url: session.url });
}
catch (error) {
  console.error("Error creating checkout session:", error);
  res.status(500).json({ error: "Internal Server Error" });
}
});


router.post(
  "/webhook",
  express.json({ type: "application/json" }),
  async (req, res) => {
    let data;
    let eventType;

    // Check if webhook signing is configured.
    let webhookSecret;
    webhookSecret = process.env.STRIPE_WEB_HOOK;

    if (webhookSecret) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let event;
      let signature = req.headers["stripe-signature"];

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          webhookSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed:  ${err}`);
        return res.sendStatus(400);
      }
      // Extract the object from the event.
      data = event.data.object;
      eventType = event.type;
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // retrieve the event data directly from the request body.
      data = req.body.data.object;
      eventType = req.body.type;
    }

    // Handle the checkout.session.completed event
    if (eventType === "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer)
        .then(async (customer) => {
          try {
            // CREATE ORDER
            console.log("customer",customer,"data", data);
          } catch (err) {
            console.log(typeof createOrder);
            console.log(err);
          }
        })
        .catch((err) => console.log(err.message));
    }

    res.status(200).end();
  }
);




module.exports = router;
