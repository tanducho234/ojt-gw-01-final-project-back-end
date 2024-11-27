const express = require('express');
const router = express.Router();
const { addAddress, getAddresses, deleteAddress } = require('../controllers/addressController');
const { authenticate } = require('../middleware/auth');


router.use(authenticate);

// Tạo địa chỉ mới
router.post('/', addAddress);

// Lấy tất cả địa chỉ của user
router.get('/', getAddresses);

// Xóa địa chỉ theo ID
router.delete('/:id', deleteAddress);

module.exports = router;