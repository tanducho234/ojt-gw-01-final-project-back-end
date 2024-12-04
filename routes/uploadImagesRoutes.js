//uploadImagesRoute
const express = require("express");
const upload = require("../middleware/upload");
const router = express.Router();
const uploadImagesController = require("../controllers/uploadImagesController");

// Route for uploading a single image
router.post(
  "/single",
  upload.single("image"),
  uploadImagesController.uploadSingleImage
);

// Route for uploading multiple images
router.post(
  "/",
  upload.array("images", 10),
  uploadImagesController.uploadImages
);

module.exports = router;
