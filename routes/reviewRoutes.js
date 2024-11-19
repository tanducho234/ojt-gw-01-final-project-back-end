const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Route to add review
router.post('/', reviewController.addReview);

// Route to get 5 random 5-star reviews
router.get('/random-top-reviews', reviewController.getRandomTopReviews);

// Route to get reviews by userId
router.get('/user/:userId', reviewController.getReviewsByUserId);

// Route to get reviews by productId
router.get('/product/:productId', reviewController.getReviewsByProductId);

module.exports = router;


/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Add a review for a product
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID who is submitting the review
 *               productId:
 *                 type: string
 *                 description: Product ID being reviewed
 *               rating:
 *                 type: number
 *                 format: float
 *                 description: Rating of the product (0-5)
 *                 example: 4.5
 *               feedback:
 *                 type: string
 *                 description: Written feedback or review text
 *                 example: "Great product! Highly recommend."
 *     responses:
 *       201:
 *         description: Review added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Review ID
 *                 userId:
 *                   type: string
 *                   description: User ID who created the review
 *                 productId:
 *                   type: string
 *                   description: Product ID being reviewed
 *                 rating:
 *                   type: number
 *                   format: float
 *                   description: Rating given by the user
 *                 feedback:
 *                   type: string
 *                   description: Review feedback text
 *       400:
 *         description: Invalid rating or request body
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/reviews/random-top-reviews:
 *   get:
 *     summary: Get 5 random 5-star reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: A list of 5 random 5-star reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Review ID
 *                   userId:
 *                     type: string
 *                     description: User who wrote the review
 *                   productId:
 *                     type: string
 *                     description: Product being reviewed
 *                   rating:
 *                     type: number
 *                     format: float
 *                     description: Rating of the product (5)
 *                   feedback:
 *                     type: string
 *                     description: Written feedback or review text
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/reviews/user/{userId}:
 *   get:
 *     summary: Get all reviews by a specific user
 *     tags: [Reviews]
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID of the user to fetch reviews for
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of reviews written by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   productId:
 *                     type: string
 *                   rating:
 *                     type: number
 *                     format: float
 *                   feedback:
 *                     type: string
 *       404:
 *         description: No reviews found for the specified user
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/reviews/product/{productId}:
 *   get:
 *     summary: Get all reviews for a specific product
 *     tags: [Reviews]
 *     parameters:
 *       - name: productId
 *         in: path
 *         description: ID of the product to fetch reviews for
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of reviews for the product
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   rating:
 *                     type: number
 *                     format: float
 *                   feedback:
 *                     type: string
 *       404:
 *         description: No reviews found for the specified product
 *       500:
 *         description: Internal server error
 */
