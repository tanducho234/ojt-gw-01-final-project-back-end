const express = require("express");
const Stripe = require("stripe");
const Voucher = require("../models/Voucher");

require("dotenv").config();

const stripe = Stripe(process.env.STRIPE_KEY);

const router = express.Router();

router.post("/create-checkout-session", express.json(), async (req, res) => {
  try {
    const { userId, cartItems, voucher, shippingMethod, shippingAddress } =
      req.body;
    const orderValue = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    // Validate shipping method
    const shippingOptions = {
      economy: 200, // $2
      standard: 350, // $3.5
      express: 500, // $5
    };
    const shippingCost =
      shippingOptions[shippingMethod] || shippingOptions.standard;

    // Validate voucher (replace this with your actual voucher validation logic)
    let coupon;
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
        shippingAddress: JSON.stringify(shippingAddress),
        voucher: JSON.stringify(voucher),
        shippingMethod,
        ...cartItems.reduce((metadata, item, index) => {
          const { imgLink, ...rest } = item;
          metadata[`product${index + 1}`] = JSON.stringify(rest);
          return metadata;
        }, {}),
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
      locale: "en",
    });

    res.send({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
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
            console.log("customer", customer, "data", data);
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



async function applyVoucher(voucherCode, orderValue) {
  // Find the voucher by code
  const voucher = await Voucher.findOne({ code: voucherCode });

  if (!voucher) {
    throw new Error('Voucher not found');
  }

  // Check if the voucher is valid
  if (!voucher.canBeUsed()) {
    throw new Error('Voucher is either expired, inactive, or has reached its usage limit');
  }

  // Validate minimum order value
  if (orderValue < voucher.minOrderValue) {
    throw new Error(
      `Order value must be at least ${voucher.minOrderValue} to use this voucher`
    );
  }

  // Prepare Stripe coupon creation
  let coupon;
  if (voucher.discountPercentage) {
    // Create a percentage-off coupon
    coupon = await stripe.coupons.create({
      percent_off: voucher.discountPercentage,
      duration: 'once',
    });
  } else if (voucher.discountAmount) {
    // Create a fixed amount-off coupon
    coupon = await stripe.coupons.create({
      amount_off: voucher.discountAmount * 100, // Stripe uses cents for fixed amounts
      currency: 'usd',
      duration: 'once',
    });
  } else {
    throw new Error('Invalid voucher configuration');
  }

  // Increment usage count if the voucher is restricted
  if (voucher.type === 'restricted') {
    voucher.usageCount += 1;
    await voucher.save();
  }

  return coupon;
}


module.exports = router;
