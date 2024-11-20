const Cart = require("../models/Cart");

// Thêm sản phẩm vào giỏ hàng
exports.addProductToCart = async (req, res) => {
  const userId = req.user._id; // Lấy userId từ req.user
  console.log(userId);
  const { productId, color, size, quantity } = req.body;

  if (!productId || !color || !size || !quantity) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Tạo giỏ hàng mới nếu chưa tồn tại
      cart = new Cart({ userId, products: [] });
    }

    // Kiểm tra sản phẩm đã có trong giỏ chưa
    const productIndex = cart.products.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.color === color &&
        item.size === size
    );

    if (productIndex > -1) {
      // Cập nhật số lượng nếu sản phẩm đã tồn tại
      cart.products[productIndex].quantity += quantity;
    } else {
      // Thêm sản phẩm mới
      cart.products.push({ productId, color, size, quantity });
    }

    await cart.save();
    res.status(200).json(cart );
  } catch (error) {
    res.status(500).json({ message: "Failed to add product to cart.", error });
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
exports.updateCartQuantity = async (req, res) => {
  const userId = req.user._id; // Lấy userId từ req.user
  const { productId, color, size, quantity } = req.body;

  if (!productId || !color || !size || quantity === undefined) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    const productIndex = cart.products.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.color === color &&
        item.size === size
    );

    if (productIndex > -1) {
      cart.products[productIndex].quantity = quantity;

      if (quantity === 0) {
        // Xóa sản phẩm nếu số lượng bằng 0
        cart.products.splice(productIndex, 1);
      }

      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: "Product not found in cart." });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to update cart.", error });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
exports.removeProductFromCart = async (req, res) => {
  const userId = req.user._id; // Lấy userId từ req.user
  const { productId, color, size } = req.body;

  if (!productId || !color || !size) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    const productIndex = cart.products.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.color === color &&
        item.size === size
    );

    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);
      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: "Product not found in cart." });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to remove product from cart.", error });
  }
};

// Lấy giỏ hàng của người dùng
exports.getUserCart = async (req, res) => {
  const userId = req.user._id; // Lấy userId từ req.user

  try {
    const cart = await Cart.findOne({ userId }).populate("products.productId");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cart.", error });
  }
};
