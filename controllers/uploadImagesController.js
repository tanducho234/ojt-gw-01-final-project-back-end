const cloudinary = require("../config/cloudinary");

exports.uploadImages = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  } else {
    console.log("number of images:", req.files.length);
  }

  try {
    // Iterate over the files in req.files
    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "image",
              folder: "final_ojt_images",
              transformation: [{ width: 300, height: 300, crop: "pad" }],
            },
            (error, result) => {
              if (error) {
                reject(error); // Reject promise if error occurs
              } else {
                resolve(result); // Resolve promise with the result
              }
            }
          )
          .end(file.buffer); // End the stream with file buffer
      });
    });

    // Wait for all files to be uploaded
    const results = await Promise.all(uploadPromises);

    // Return the result for all files uploaded
    return res.status(200).json({
      message: "Images uploaded successfully",
      results: results, // Send back the results for all uploaded images
    });
  } catch (error) {
    console.error("Error during image upload", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.uploadSingleImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "image",
          folder: "final_ojt_images",
          transformation: [{ width: 300, height: 300, crop: "pad" }],
        },
        (error, result) => {
          if (error) {
            return res.status(500).json({ error: error.message });
          }
          console.log(result.url)
          return res.status(200).json(result.url);
        }
      )
      .end(req.file.buffer);
  } catch (error) {
    console.error("Error during image upload", error);
    return res.status(500).json({ error: error.message });
  }
};
