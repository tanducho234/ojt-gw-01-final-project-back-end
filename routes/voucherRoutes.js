const express = require("express");
const router = express.Router();
const vouchersController = require("../controllers/voucherController"); // Đảm bảo đường dẫn chính xác
const { authenticate, authorize } = require("../middleware/auth");

// Lấy tất cả voucher
router.get("/", vouchersController.getAllVouchers);
router.get("/admin", authenticate, authorize(["admin"]), vouchersController.getAllVouchers);

// Kiểm tra voucher có thể sử dụng được không
router.post("/check", vouchersController.checkVoucher);

// Thêm mới voucher
router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  vouchersController.createVoucher
);

// Cập nhật voucher
router.put(
  "/:id",
  authenticate,
  authorize(["admin"]),
  vouchersController.updateVoucher
);

module.exports = router;
