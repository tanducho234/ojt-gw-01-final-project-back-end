const Product = require("../models/Product");
const Brand = require("../models/Brand");
const Style = require("../models/Style");
const Category = require("../models/Category");
const cacheService = require("../services/cacheService");

// Helper function to generate cache key
const generateCacheKey = (params) => {
  return `product:${Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&")}`;
};

exports.getAllProducts = async (req, res) => {
  try {
    const {
      key,
      sortBy,
      price,
      color,
      size,
      category,
      style,
      brand,
      order = "asc",
      page,
      limit = 10,
    } = req.query;

    // Generate cache key based on query parameters
    const cacheKey = generateCacheKey(req.query);

    // Try to get from cache first
    const cachedProducts = await cacheService.get(cacheKey);
    if (cachedProducts) {
      return res.json(cachedProducts);
    }

    // Build query object
    const query = {};

    if (key) {
      query.name = { $regex: key, $options: "i" };
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

    // Sorting logic
    const sortOptions = {};
    if (sortBy && order) {
      const sortOrder = order.toLowerCase() === "asc" ? 1 : -1;
      sortOptions[sortBy] = sortOrder;
    }

    const products = await Product.find(query).sort(sortOptions);

    let filteredProducts = products;
    if (price) {
      const [min, max] = price.split("-").map(Number);
      filteredProducts = products.filter((product) => {
        const salePrice = product.price * (1 - product.salePercentage / 100);
        return salePrice >= min && salePrice <= max;
      });
    }

    // Cache the results
    await cacheService.set(cacheKey, filteredProducts);

    res.json(filteredProducts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `product:${id}`;

    // Try to get from cache first
    const cachedProduct = await cacheService.get(cacheKey);
    if (cachedProduct) {
      return res.status(200).json(cachedProduct);
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại." });
    }

    // Cache the product
    await cacheService.set(cacheKey, product);

    res.status(200).json(product);
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
    res.status(500).json({ message: "Không thể lấy sản phẩm." });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();

    // Invalidate all product caches when a new product is created
    await cacheService.invalidateProductCache();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Lỗi khi tạo sản phẩm mới:", error);
    res.status(500).json({ message: "Không thể tạo sản phẩm." });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại." });
    }

    // Invalidate all product caches when a product is updated
    await cacheService.invalidateProductCache();

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    res.status(500).json({ message: "Không thể cập nhật sản phẩm." });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại." });
    }

    // Invalidate all product caches when a product is deleted
    await cacheService.invalidateProductCache();

    res.status(200).json({ message: "Xóa sản phẩm thành công." });
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    res.status(500).json({ message: "Không thể xóa sản phẩm." });
  }
};

exports.updateColorVariant = async (req, res) => {
  const { id: productId } = req.params;
  const { color, sizes, imgLinks } = req.body;

  if (!color || !sizes || !Array.isArray(sizes) || !imgLinks) {
    return res
      .status(400)
      .json({ message: "Color, sizes, and imgLinks are required." });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const existingColorIndex = product.colors.findIndex(
      (c) => c.color === color
    );
    if (existingColorIndex >= 0) {
      product.colors[existingColorIndex].sizes = sizes;
      product.colors[existingColorIndex].imgLinks = imgLinks;
    } else {
      product.colors.push({ color, sizes, imgLinks });
    }

    await product.save();

    // Invalidate all product caches when a color variant is updated
    await cacheService.invalidateProductCache();

    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating color variant.", error: error.message });
  }
};
