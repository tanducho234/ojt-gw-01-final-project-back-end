const OrderDetail = require("../models/OrderDetail");
const {
  createStripeCheckoutSession,
} = require("../services/stripeCheckoutService");

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const {
      products,
      status,
      voucherDiscountAmount,
      shippingCost,
      totalPrice,
      shippingAddress,
      paymentMethod,
    } = req.body;
    console.log("aaaa",voucherDiscountAmount)
    let paymentLink = "";
    let shippingMethod = "standard";
    if (shippingCost == 2) {
      shippingMethod = "economy";
    } else if (shippingCost == 5) {
      shippingMethod = "express";
    }


    const newOrder = new OrderDetail({
      userId: req.user.id, // Extracted from the authenticated user
      products,
      voucherDiscountAmount,
      shippingCost,
      totalPrice,
      shippingAddress,
      paymentMethod,
    });
    await newOrder.save();

    console.log("aaaa",voucherDiscountAmount)

    // Create Stripe payment link
    if (paymentMethod === "Stripe") {
      paymentLink = await createStripeCheckoutSession(
        req.user.id,
        (newOrder._id).toString(),
        products,
        voucherDiscountAmount,
        shippingMethod,
      );
    }
    if (paymentLink) {
      newOrder.paymentLink = paymentLink;
    }
    
    // Save the order with the payment link added
    await newOrder.save();
    
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Unable to create order." });
  }
};

// Get all orders for the authenticated user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await OrderDetail.find({ userId: req.user.id });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Unable to fetch orders." });
  }
};

// Get a specific order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await OrderDetail.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Unable to fetch order." });
  }
};

// Update an order by ID
exports.updateOrder = async (req, res) => {
  try {
    const updateData = req.body;

    const updatedOrder = await OrderDetail.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updateData,
      { new: true }
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ message: "Order not found or not authorized." });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Unable to update order." });
  }
};

// Delete an order (optional)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await OrderDetail.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or not authorized." });
    }

    res.status(200).json({ message: "Order deleted successfully." });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Unable to delete order." });
  }
};