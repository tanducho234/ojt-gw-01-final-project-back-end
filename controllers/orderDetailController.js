const Cart = require("../models/Cart");
const OrderDetail = require("../models/OrderDetail");
const Voucher = require("../models/Voucher");
const {
  createStripeCheckoutSession,
} = require("../services/stripeCheckoutService");
const {
  createVnPayCheckoutSession,
} = require("../services/vnpayCheckoutService");

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await OrderDetail.find({}).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders." });
  }
};

exports.getShipperOrders = async (req, res) => {
  try {
    const orders = await OrderDetail.find({
      status: { $nin: ["Pending", "Preparing","Canceled"] }, // Exclude Pending and Preparing statuses
    }).sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders for shipper:", error);
    res.status(500).json({ message: "Failed to fetch orders." });
  }
};
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
      voucherCode,
    } = req.body;
    let paymentLink = "";
    let shippingMethod = "standard";
    if (shippingCost == 2) {
      shippingMethod = "economy";
    } else if (shippingCost == 5) {
      shippingMethod = "express";
    }
    //increase useage count of voucher by id
    if (voucherCode) {
      const voucher = await Voucher.findOne({ code: voucherCode });
      if (voucher) {
        voucher.usageCount += 1;
        await voucher.save();
      }
    }
    const newOrder = new OrderDetail({
      userId: req.user.id, // Extracted from the authenticated user
      products,
      voucherDiscountAmount,
      shippingCost,
      totalPrice,
      shippingAddress,
      paymentMethod,
      statusHistory: [
        {
          status: "Pending",
        },
      ],
    });
    await newOrder.save();

    // Create Stripe payment link
    if (paymentMethod === "Stripe") {
      paymentLink = await createStripeCheckoutSession(
        req.user.id,
        newOrder._id.toString(),
        products,
        voucherDiscountAmount,
        shippingMethod
      );
    } //else VNPAY
    else if (paymentMethod === "VNPAY") {
      paymentLink = createVnPayCheckoutSession(
        (totalPrice * 25000).toFixed(2),
        "VNBANK",
        newOrder._id.toString()
      );
    }
    if (paymentLink) {
      newOrder.paymentLink = paymentLink;
    }

    // Save the order with the payment link added
    await newOrder.save();

    const updatedCart = await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { products: [] },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Unable to create order." });
  }
};

// Get all orders for the authenticated user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await OrderDetail.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Unable to fetch orders." });
  }
};

// Get a specific order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await OrderDetail.findOne({ _id: req.params.id });

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

    // If status is being updated, add to status history
    if (updateData.status) {
      updateData.$push = {
        statusHistory: {
          status: updateData.status,
          timestamp: new Date(),
          description: updateData.description,
        },
      };
    }

    const updatedOrder = await OrderDetail.findOneAndUpdate(
      { _id: req.params.id },
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
    const order = await OrderDetail.findOneAndDelete({ _id: req.params.id });

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
