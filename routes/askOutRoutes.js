const express = require('express');
const router = express.Router();
const askOutController = require('../controllers/askOutController');

/**
 * @swagger
 * /api/ask-outs:
 *   get:
 *     summary: Get all ask-outs
 *     tags: [AskOuts]
 *     responses:
 *       200:
 *         description: List of all ask-outs
 */
router.get('/', askOutController.getAllAskOuts);

/**
 * @swagger
 * /api/ask-outs/{id}:
 *   get:
 *     summary: Get ask-out by ID
 *     tags: [AskOuts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ask-out details
 *       404:
 *         description: Ask-out not found
 */
router.get('/:id', askOutController.getAskOutById);

/**
 * @swagger
 * /api/ask-outs:
 *   post:
 *     summary: Create a new ask-out
 *     tags: [AskOuts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               gifUrl:
 *                 type: string
 *               yesLabel:
 *                 type: string
 *               noLabel:
 *                 type: string
 *               yesTitle:
 *                 type: string
 *               yesSubtext:
 *                 type: string
 *               yesImageUrl:
 *                 type: string
 *             required:
 *               - question
 *     responses:
 *       201:
 *         description: Ask-out created successfully
 */
router.post('/', askOutController.createAskOut);

/**
 * @swagger
 * /api/ask-outs/{id}:
 *   put:
 *     summary: Update an ask-out
 *     tags: [AskOuts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               gifUrl:
 *                 type: string
 *               yesLabel:
 *                 type: string
 *               noLabel:
 *                 type: string
 *               yesTitle:
 *                 type: string
 *               yesSubtext:
 *                 type: string
 *               yesImageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ask-out updated successfully
 *       404:
 *         description: Ask-out not found
 */
router.put('/:id', askOutController.updateAskOut);

/**
 * @swagger
 * /api/ask-outs/{id}:
 *   delete:
 *     summary: Delete an ask-out
 *     tags: [AskOuts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ask-out deleted successfully
 *       404:
 *         description: Ask-out not found
 */
router.delete('/:id', askOutController.deleteAskOut);

module.exports = router;
