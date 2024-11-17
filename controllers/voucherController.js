const Voucher = require('../models/Voucher'); // Đảm bảo đường dẫn chính xác

// Lấy tất cả voucher
exports.getAllVouchers = async (req, res) => {
    try {
      // Tìm tất cả voucher loại 'public'
      const vouchers = await Voucher.find({ type: 'public' });
  
      // Lọc các voucher có thể sử dụng được
      const validVouchers = vouchers.filter(voucher => voucher.canBeUsed());
  
      res.status(200).json(validVouchers);
    } catch (error) {
      console.error('Lỗi khi lấy tất cả voucher:', error);
      res.status(500).json({ message: 'Không thể lấy voucher.' });
    }
  };
  
// Kiểm tra voucher có thể sử dụng được không
exports.checkVoucher = async (req, res) => {
  try {
    const { code } = req.params;
    const voucher = await Voucher.findOne({ code });

    if (!voucher) {
      return res.status(404).json({ message: 'Voucher không tồn tại.' });
    }

    const canUse = voucher.canBeUsed();
    res.status(200).json({ canUse });
  } catch (error) {
    console.error('Lỗi khi kiểm tra voucher:', error);
    res.status(500).json({ message: 'Không thể kiểm tra voucher.' });
  }
};

// Thêm mới voucher
exports.createVoucher = async (req, res) => {
  try {
    const { code, type, discountAmount, discountPercentage, minOrderValue, maxUsage, expirationDate } = req.body;

    const newVoucher = new Voucher({
      code,
      type,
      discountAmount,
      discountPercentage,
      minOrderValue,
      maxUsage,
      expirationDate
    });

    await newVoucher.save();
    res.status(201).json(newVoucher);
  } catch (error) {
    console.error('Lỗi khi tạo voucher:', error);
    res.status(500).json({ message: 'Không thể tạo voucher.' });
  }
};

// Cập nhật voucher theo ID
exports.updateVoucher = async (req, res) => {
    try {
      const { id } = req.params;  // Lấy ID từ params
      const updateData = req.body; // Dữ liệu cần cập nhật
  
      // Tìm voucher theo ID và cập nhật
      const updatedVoucher = await Voucher.findByIdAndUpdate(id, updateData, { new: true });
  
      if (!updatedVoucher) {
        return res.status(404).json({ message: 'Voucher không tồn tại.' });
      }
  
      res.status(200).json(updatedVoucher);
    } catch (error) {
      console.error('Lỗi khi cập nhật voucher:', error);
      res.status(500).json({ message: 'Không thể cập nhật voucher.' });
    }
  };
  