// styleroute.js
const express = require("express");
const router = express.Router();
const styleController = require("../controllers/styleController");
const { authenticate, authorize } = require("../middleware/auth");

/**
 * @swagger
 * /api/styles:
 *   get:
 *     summary: Get all styles
 *     tags: [Styles]
 *     responses:
 *       200:
 *         description: List of all styles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   imgLink:
 *                     type: string
 */
router.get("/", styleController.getAllStyles);

/**
 * @swagger
 * /api/styles/{id}:
 *   get:
 *     summary: Get style by ID
 *     tags: [Styles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Style details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 imgLink:
 *                   type: string
 *       404:
 *         description: Style not found
 */
router.get("/:id", styleController.getStyleById);

/**
 * @swagger
 * /api/styles:
 *   post:
 *     summary: Create a new style
 *     tags: [Styles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               imgLink:
 *                 type: string
 *             required:
 *               - name
 *               - description
 *               - imgLink
 *     responses:
 *       201:
 *         description: Style created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 imgLink:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  styleController.createStyle
);

/**
 * @swagger
 * /api/styles/{id}:
 *   put:
 *     summary: Update an existing style
 *     tags: [Styles]
 *     security:
 *       - bearerAuth: []
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               imgLink:
 *                 type: string
 *     responses:
 *       200:
 *         description: Style updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 imgLink:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Style not found
 */
router.put(
  "/:id",
  authenticate,
  authorize(["admin"]),
  styleController.updateStyle
);

/**
 * @swagger
 * /api/styles/{id}:
 *   delete:
 *     summary: Delete a style
 *     tags: [Styles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Style deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Style not found
 */
router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  styleController.deleteStyle
);

module.exports = router;
