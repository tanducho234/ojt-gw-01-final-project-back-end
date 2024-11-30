const Product = require("../models/Product");
const Review = require("../models/Review");

// Thêm review
exports.addReview = async (req, res) => {
  try {
    const { userId, productId, rating, feedback } = req.body;

    if (rating < 0 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 0 and 5." });
    }

    // Create the new review
    const newReview = new Review({
      userId,
      productId,
      rating,
      feedback,
    });

    // Save the new review
    const savedReview = await newReview.save();

    // Update totalReview and totalRating for the product
    await Product.findByIdAndUpdate(
      productId,
      {
        $inc: { totalReview: 1, totalRating: rating },
      },
      { new: true }
    ).then(async (product) => {
      await Product.findByIdAndUpdate(
        productId,
        {
          $set: { rating: product.totalRating / product.totalReview },
        },
        { new: true }
      );
    });
    res.status(201).json(savedReview);
  } catch (error) {
    console.error("Error while adding review:", error);
    res.status(500).json({ message: "Unable to add review." });
  }
};

// Lấy random 5 đánh giá 5 sao
exports.getRandomTopReviews = async (req, res) => {
  try {
    const reviews = await Review.aggregate([
      { $match: { rating: 5 } },
      { $sample: { size: 5 } },
    ]);
    const populatedReviews = await Review.populate(reviews, {
      path: "userId", // Trường cần populate
      select: "fullName", // Chỉ lấy trường 'name' của Product
    });

    res.status(200).json(populatedReviews);
  } catch (error) {
    console.error("Lỗi khi lấy random review:", error);
    res.status(500).json({ message: "Không thể lấy review." });
  }
};

// Lấy review theo userId
exports.getReviewsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.find({ userId }).populate(
      "productId",
      "name generalImgLink"
    );
    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy đánh giá nào cho user này." });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Lỗi khi lấy review theo userId:", error);
    res.status(500).json({ message: "Không thể lấy review." });
  }
};

// Lấy review theo productId
exports.getReviewsByProductId = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId }).populate(
      "userId",
      "fullName"
    );

    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy đánh giá nào cho sản phẩm này." });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Lỗi khi lấy review theo productId:", error);
    res.status(500).json({ message: "Không thể lấy review." });
  }
};
