const Product = require("../models/Product");

// Lấy tất cả sản phẩm
const Brand = require("../models/Brand");
const Style = require("../models/Style");
const Category = require("../models/Category");

exports.getAllProducts = async (req, res) => {
  try {
    const {
      color,
      size,
      gender,
      keyword,
      minPrice,
      maxPrice,
      category,
      brand,
      style,
    } = req.query;
    const filter = {};

    // Lọc theo màu sắc
    if (color) {
      filter["colors.color"] = color;
    }

    // Lọc theo kích cỡ
    if (size) {
      filter["colors.sizes.size"] = size;
    }

    // Lọc theo giới tính
    if (gender) {
      filter.gender = gender;
    }

    // Lọc theo category (tra cứu ID từ text)
    if (category) {
      const foundCategory = await Category.findOne({ name: category });
      if (foundCategory) {
        filter.categoryId = foundCategory._id;
      } else {
        return res
          .status(404)
          .json({ message: `Không tìm thấy danh mục: ${category}` });
      }
    }

    // Lọc theo brand (tra cứu ID từ text)
    if (brand) {
      const foundBrand = await Brand.findOne({ name: brand });
      if (foundBrand) {
        filter.brandId = foundBrand._id;
      } else {
        return res
          .status(404)
          .json({ message: `Không tìm thấy thương hiệu: ${brand}` });
      }
    }

    // Lọc theo style (tra cứu ID từ text)
    if (style) {
      const foundStyle = await Style.findOne({ name: style });
      if (foundStyle) {
        filter.styleId = foundStyle._id;
      } else {
        return res
          .status(404)
          .json({ message: `Không tìm thấy kiểu dáng: ${style}` });
      }
    }

    // Lọc theo khoảng giá
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Lọc theo từ khóa (tên hoặc mô tả sản phẩm)
    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error);
    res.status(500).json({ message: "Không thể lấy sản phẩm." });
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
