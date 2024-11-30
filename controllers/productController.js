const Product = require("../models/Product");

// Lấy tất cả sản phẩm
const Brand = require("../models/Brand");
const Style = require("../models/Style");
const Category = require("../models/Category");

exports.getAllProducts = async (req, res) => {
  try {
    const { key, sortBy, price, color, size, category, style, brand ,order="asc"} =
      req.query;

    // Build query object
    const query = {};

    if (key) {
      query.name = { $regex: key, $options: "i" }; // Tìm kiếm từ khóa trong tên sản phẩm (không phân biệt chữ hoa/thường)
    }
    if (color) {
      query["colors.color"] = color;
    }
    if (size) {
      query["colors.sizes.size"] = size;
    }
    if (category) {
      query.categoryId = category;
    }
    if (style) {
      query.styleId = style;
    }
    if (brand) {
      query.brandId = brand;
    }
    // if (price) {
    //   const [min, max] = price.split("-").map(Number);
    //   query.price = { $gte: min, $lte: max };
    // }

    // Sorting logic
    const sortOptions = {};

    if (sortBy && order) {
      // Determine if order is asc or desc
      const sortOrder = order.toLowerCase() === "asc" ? 1 : -1;
      sortOptions[sortBy] = sortOrder;
    }

    console.log("Query:", query, "sortOptions:", sortOptions);
    const products = await Product.find(query).sort(sortOptions);

    if (price) {
      const [min, max] = price.split("-").map(Number);
      // Filter products based on the sale price (after discount)
      const filteredProducts = products.filter((product) => {
        const salePrice = product.price * (1 - product.salePercentage / 100);
        return salePrice >= min && salePrice <= max;
      });
      return res.json(filteredProducts);
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};
// Lấy chi tiết một sản phẩm theo ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại." });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
    res.status(500).json({ message: "Không thể lấy sản phẩm." });
  }
};

// Thêm mới một sản phẩm
exports.createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Lỗi khi tạo sản phẩm mới:", error);
    res.status(500).json({ message: "Không thể tạo sản phẩm." });
  }
};

// Cập nhật sản phẩm theo ID
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại." });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    res.status(500).json({ message: "Không thể cập nhật sản phẩm." });
  }
};

// Xóa sản phẩm theo ID
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại." });
    }

    res.status(200).json({ message: "Xóa sản phẩm thành công." });
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    res.status(500).json({ message: "Không thể xóa sản phẩm." });
  }
};
