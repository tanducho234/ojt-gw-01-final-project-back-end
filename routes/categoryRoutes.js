//category.js
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { authenticate, authorize } = require("../middleware/auth");

router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  categoryController.createCategory
);
router.put(
  "/:id",
  authenticate,
  authorize(["admin"]),
  categoryController.updateCategory
);
router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  categoryController.deleteCategory
);

module.exports = router;
