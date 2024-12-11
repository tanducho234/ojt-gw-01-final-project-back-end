const Cart = require("../models/Cart");
const OrderDetail = require("../models/OrderDetail");
const Voucher = require("../models/Voucher");
const Product = require("../models/Product");
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



const updateVariantQuantities = async (products) => {
  try {
    const updatePromises = products.map(async (product) => {
      return Product.findOneAndUpdate(
        { 
          _id: product.productId,
          'colors.color': product.color, // Find the color
          'colors.sizes.size': product.size // Find the size within the color
        },
        {
          $inc: {
            // Decrease the quantity of the specified size in the color array
            'colors.$.sizes.$[elem].quantity': -product.quantity
          }
        },
        {
          new: true, // Return the updated document
          arrayFilters: [{ 'elem.size': product.size }] // Filter the size array to update the correct size
        }
      );
    });

    await Promise.all(updatePromises); // Ensure all updates happen before function exits
    console.log('Product variants updated successfully');
  } catch (error) {
    console.error('Error updating product variant quantities:', error);
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
    await updateVariantQuantities(products);
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
const updateSoldQuantities = async (products) => {
  try {
    console.log(products)
    const updatePromises = products.map(async (product) => {
      return Product.findByIdAndUpdate(
        product.productId,
        { $inc: { soldQuantity: product.quantity } },
        { new: true }
      );
    });
    await Promise.all(updatePromises); // Ensure all updates happen before function exits
  } catch (error) {
    console.error('Error updating sold quantities:', error);
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const updateData = req.body;
    const { status, description } = updateData;

    // If status is being updated, add to the status history
    if (status) {
      updateData.$push = {
        statusHistory: {
          status,
          timestamp: new Date(),
          description,
        },
      };
    }

    // Find the order first
    const order = await OrderDetail.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // If status is 'delivered', update the sold quantities of the products
    if (status === 'Delivered') {
      // Start updating sold quantities in the background
      updateSoldQuantities(order.products);
    }

    // Update the order
    const updatedOrder = await OrderDetail.findOneAndUpdate(
      { _id: req.params.id },
      updateData,
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found or not authorized." });
    }

    // Send response immediately
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
