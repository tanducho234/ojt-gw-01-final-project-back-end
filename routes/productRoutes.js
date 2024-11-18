//routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');

// Lấy tất cả sản phẩm hoặc tìm kiếm theo query parameters
router.get('/', productController.getAllProducts);

// Lấy chi tiết một sản phẩm theo ID
router.get('/:id', productController.getProductById);

// Thêm mới sản phẩm (chỉ admin)
router.post('/', authenticate, authorize(['admin']), productController.createProduct);

// Cập nhật sản phẩm theo ID (chỉ admin)
router.put('/:id', authenticate, authorize(['admin']), productController.updateProduct);

// Xóa sản phẩm theo ID (chỉ admin)
router.delete('/:id', authenticate, authorize(['admin']), productController.deleteProduct);

module.exports = router;


/**
 * @swagger
 * /api/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Retrieve a list of products
 *     description: Fetch a list of all products available in the store.
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "673b09cf879b66df57abbdbf"
 *                   name:
 *                     type: string
 *                     example: "Men's Casual T-Shirt"
 *                   gender:
 *                     type: string
 *                     enum: ["male", "female", "unisex"]
 *                     example: "male"
 *                   categoryId:
 *                     type: string
 *                     example: "67371d1bcd2d600f646a0609"
 *                   styleId:
 *                     type: string
 *                     example: "673a06cf879b66df57abbdbd"
 *                   brandId:
 *                     type: string
 *                     example: "6736f1f1880764a00b620391"
 *                   price:
 *                     type: number
 *                     example: 30.00
 *                   salePercentage:
 *                     type: number
 *                     example: 10
 *                   description:
 *                     type: string
 *                     example: "A comfortable and stylish casual T-shirt, perfect for everyday wear."
 *                   colors:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         color:
 *                           type: string
 *                           example: "Red"
 *                         sizes:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               size:
 *                                 type: string
 *                                 example: "S"
 *                               price:
 *                                 type: number
 *                                 example: 28.00
 *                               quantity:
 *                                 type: number
 *                                 example: 50
 *                         imgLinks:
 *                           type: array
 *                           items:
 *                             type: string
 *                             example: "https://placehold.co/300x300/ff0000/white?text=Red+T-Shirt+1"
 *                   totalRating:
 *                     type: number
 *                     example: 4.5
 *                   totalReview:
 *                     type: number
 *                     example: 120
 *       400:
 *         description: Invalid query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid query parameters."
 */


/**
 * @swagger
 * /api/products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Create a new product
 *     description: Adds a new product to the database with details such as name, gender, category, style, brand, colors, sizes, and images.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Men's Casual T-Shirt"
 *               gender:
 *                 type: string
 *                 enum: ["male", "female", "unisex"]
 *                 example: "male"
 *               categoryId:
 *                 type: string
 *                 example: "67371d1bcd2d600f646a0609"
 *               styleId:
 *                 type: string
 *                 example: "673a06cf879b66df57abbdbd"
 *               brandId:
 *                 type: string
 *                 example: "6736f1f1880764a00b620391"
 *               price:
 *                 type: number
 *                 example: 30.00
 *               salePercentage:
 *                 type: number
 *                 example: 10
 *               description:
 *                 type: string
 *                 example: "A comfortable and stylish casual T-shirt, perfect for everyday wear."
 *               colors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     color:
 *                       type: string
 *                       example: "Red"
 *                     sizes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           size:
 *                             type: string
 *                             example: "M"
 *                           price:
 *                             type: number
 *                             example: 30.00
 *                           quantity:
 *                             type: number
 *                             example: 40
 *                     imgLinks:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "https://placehold.co/300x300/ff0000/white?text=Red+T-Shirt+1"
 *               totalRating:
 *                 type: number
 *                 example: 4.5
 *               totalReview:
 *                 type: number
 *                 example: 120
 *     responses:
 *       201:
 *         description: Product successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product created successfully."
 *                 productId:
 *                   type: string
 *                   example: "673b09cf879b66df57abbdbf"
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid data. Please check your input."
 *       500:
 *         description: Internal server error.
 */
