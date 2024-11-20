const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const cartController = require("../controllers/cartController");


router.use(authenticate);
// Thêm sản phẩm vào giỏ hàng
router.post("/add", cartController.addProductToCart);

// Cập nhật số lượng sản phẩm
router.put("/update", cartController.updateCartQuantity);

// Xóa sản phẩm khỏi giỏ hàng
router.delete("/remove", cartController.removeProductFromCart);

// Lấy giỏ hàng của người dùng
router.get("/", cartController.getUserCart);

module.exports = router;


/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: API for managing shopping cart
 */

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add a product to the user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               color:
 *                 type: string
 *               size:
 *                 type: string
 *               quantity:
 *                 type: integer
 *             required:
 *               - productId
 *               - color
 *               - size
 *               - quantity
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *       400:
 *         description: Bad Request, missing fields
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /cart/update:
 *   put:
 *     summary: Update the quantity of a product in the user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               color:
 *                 type: string
 *               size:
 *                 type: string
 *               quantity:
 *                 type: integer
 *             required:
 *               - productId
 *               - color
 *               - size
 *               - quantity
 *     responses:
 *       200:
 *         description: Product quantity updated successfully
 *       400:
 *         description: Bad Request, missing fields or invalid data
 *       404:
 *         description: Product not found in cart
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /cart/remove:
 *   delete:
 *     summary: Remove a product from the user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               color:
 *                 type: string
 *               size:
 *                 type: string
 *             required:
 *               - productId
 *               - color
 *               - size
 *     responses:
 *       200:
 *         description: Product removed from cart successfully
 *       400:
 *         description: Bad Request, missing fields
 *       404:
 *         description: Product not found in cart
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get the user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *                       color:
 *                         type: string
 *                       size:
 *                         type: string
 *                       quantity:
 *                         type: integer
 *                       imgLink:
 *                         type: string
 *       401:
 *         description: Unauthorized, authentication failed
 *       500:
 *         description: Internal Server Error
 */
