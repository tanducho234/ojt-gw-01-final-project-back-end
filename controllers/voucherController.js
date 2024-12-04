const Voucher = require("../models/Voucher"); // Đảm bảo đường dẫn chính xác

// Lấy tất cả voucher
exports.getAllVouchersForAdmin = async (req, res) => {
  try {
    // Admin không cần lọc theo loại
    const vouchers = await Voucher.find({}).sort({ createdAt: -1 });
    res.status(200).json(vouchers);
  } catch (error) {
    console.error("Lỗi khi lấy tất cả voucher cho admin:", error);
    res.status(500).json({ message: "Không thể lấy voucher." });
  }
};

exports.getAllVouchersForUser = async (req, res) => {
  try {
    // Lọc voucher theo loại 'public'
    const vouchers = await Voucher.find({ type: "public" });

    // Lọc các voucher có thể sử dụng được
    const validVouchers = vouchers.filter((voucher) => voucher.canBeUsed());

    res.status(200).json(validVouchers);
  } catch (error) {
    console.error("Lỗi khi lấy tất cả voucher cho user:", error);
    res.status(500).json({ message: "Không thể lấy voucher." });
  }
};
// Kiểm tra voucher có thể sử dụng được không
exports.checkVoucher = async (req, res) => {
  try {
    const { code, orderValue = 0 } = req.body; // Lấy 'code' và 'orderValue' từ body
    const voucher = await Voucher.findOne({ code });

    // Kiểm tra nếu voucher không tồn tại hoặc không đủ giá trị đơn hàng
    if (!voucher || orderValue < voucher.minOrderValue) {
      return res.status(400).json({
        canUse: false, // Voucher không thể sử dụng (không tồn tại hoặc không đủ giá trị đơn hàng)
        message: "Voucher cannot be applied.",
      });
    }

    // Kiểm tra xem voucher có thể sử dụng hay không
    const canUse = voucher.canBeUsed();
    return res.status(200).json({
      canUse, // true nếu voucher có thể sử dụng, false nếu không
      message: canUse
        ? "Voucher applied successfully."
        : "Voucher cannot be applied - it may be expired or has reached its usage limit.",
      voucher: canUse ? voucher : null,
    });
  } catch (error) {
    console.error("Error while checking voucher:", error);
    res.status(500).json({ message: "Unable to check voucher." });
  }
};

// Thêm mới voucher
exports.createVoucher = async (req, res) => {
  try {
    const {
      code,
      type,
      discountAmount,
      discountPercentage,
      minOrderValue,
      maxUsage,
      expirationDate,
    } = req.body;

    const newVoucher = new Voucher({
      code,
      type,
      discountAmount,
      discountPercentage,
      minOrderValue,
      maxUsage,
      expirationDate,
    });

    await newVoucher.save();
    res.status(201).json(newVoucher);
  } catch (error) {
    console.error("Lỗi khi tạo voucher:", error);
    res.status(500).json({ message: "Không thể tạo voucher." });
  }
};

// Cập nhật voucher theo ID
exports.updateVoucher = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID từ params
    const updateData = req.body; // Dữ liệu cần cập nhật

    // Tìm voucher theo ID và cập nhật
    const updatedVoucher = await Voucher.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedVoucher) {
      return res.status(404).json({ message: "Voucher không tồn tại." });
    }

    res.status(200).json(updatedVoucher);
  } catch (error) {
    console.error("Lỗi khi cập nhật voucher:", error);
    res.status(500).json({ message: "Không thể cập nhật voucher." });
  }
};
