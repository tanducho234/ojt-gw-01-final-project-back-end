const Cart = require("../models/Cart");
const Product = require("../models/Product");

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
    res.status(200).json(cart);
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
    res
      .status(500)
      .json({ message: "Failed to remove product from cart.", error });
  }
};

// Lấy giỏ hàng của người dùng
exports.getUserCart = async (req, res) => {
  const userId = req.user._id; // Lấy userId từ req.user

  try {
    // Lấy giỏ hàng của người dùng
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Tạo giỏ hàng mới nếu chưa tồn tại
      cart = new Cart({ userId, products: [] });
      await cart.save();
      res.status(200).json([]);//return empty
    }

    // Xử lý dữ liệu giỏ hàng để thêm tên, ảnh và giá
    const cartWithDetails = await Promise.all(
      cart.products.map(async (item) => {
        // Tìm sản phẩm liên quan
        const product = await Product.findById(item.productId);

        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found.`);
        }

        // Lọc thông tin phù hợp với màu sắc và kích thước
        const colorDetails = product.colors.find((c) => c.color === item.color);

        if (!colorDetails) {
          throw new Error(
            `Color ${item.color} not found for product ${product.name}.`
          );
        }

        const sizeDetails = colorDetails.sizes.find(
          (s) => s.size === item.size
        );

        if (!sizeDetails) {
          throw new Error(
            `Size ${item.size} not found for product ${product.name} in color ${item.color}.`
          );
        }

        return {
          productId: item.productId,
          name: product.name,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          price: sizeDetails.price,
          imgLink: colorDetails.imgLinks[0], // Lấy ảnh đầu tiên của màu sắc
        };
      })
    );

    res.status(200).json(cartWithDetails);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch cart.", error: error.message });
  }
};
