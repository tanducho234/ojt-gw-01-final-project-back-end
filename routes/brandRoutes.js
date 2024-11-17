//brandRoute.js
const express = require("express");
const router = express.Router();
const brandController = require("../controllers/brandController");
const { authenticate, authorize } = require("../middleware/auth");

router.get("/", brandController.getAllBrands);
router.get("/:id", brandController.getBrandById);
router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  brandController.createBrand
);
router.put(
  "/:id",
  authenticate,
  authorize(["admin"]),
  brandController.updateBrand
);
router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  brandController.deleteBrand
);

module.exports = router;
