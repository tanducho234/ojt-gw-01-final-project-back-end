//uploadImagesRoute
const express = require("express");
const upload = require("../middleware/upload");
const router = express.Router();
const uploadImagesController = require("../controllers/uploadImagesController");

router.post(
  "/",
  upload.array("images", 10),
  uploadImagesController.uploadImages
);

module.exports = router;
