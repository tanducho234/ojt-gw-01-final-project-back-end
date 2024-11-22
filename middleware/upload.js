const multer = require("multer");

// Configure Multer for memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

module.exports = upload;
