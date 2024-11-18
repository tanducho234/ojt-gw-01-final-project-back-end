// controllers/styleController.js
const Style = require("../models/Style"); // Assuming you have a Style model

// Get all styles
const getAllStyles = async (req, res) => {
  try {
    const styles = await Style.find(); // Find all styles in the database
    res.status(200).json(styles); // Return the styles as a JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving styles" });
  }
};

// Get style by ID
const getStyleById = async (req, res) => {
  const { id } = req.params; // Extract ID from URL params
  try {
    const style = await Style.findById(id); // Find the style by ID
    if (!style) {
      return res.status(404).json({ message: "Style not found" });
    }
    res.status(200).json(style); // Return the style as a JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving style" });
  }
};

// Create a new style
const createStyle = async (req, res) => {
  const { name, description, imgLink } = req.body; // Assuming name and description are required
  try {
    const newStyle = new Style({
      name,
      description,
      imgLink,
    });

    await newStyle.save(); // Save the style to the database
    res.status(201).json(newStyle); // Return the newly created style
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error creating style" });
  }
};

// Update an existing style
const updateStyle = async (req, res) => {
  const { id } = req.params; // Extract ID from URL params
  const { name, description, imgLink } = req.body; // Assuming name and description are passed to update
  try {
    console.log(imgLink, name);
    const updatedStyle = await Style.findByIdAndUpdate(
      id,
      { name, description, imgLink },
      { new: true } // This ensures that the updated document is returned
    );

    if (!updatedStyle) {
      return res.status(404).json({ message: "Style not found" });
    }

    res.status(200).json(updatedStyle); // Return the updated style
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error updating style" });
  }
};

// Delete a style
const deleteStyle = async (req, res) => {
  const { id } = req.params; // Extract ID from URL params
  try {
    const deletedStyle = await Style.findByIdAndDelete(id); // Delete the style by ID
    if (!deletedStyle) {
      return res.status(404).json({ message: "Style not found" });
    }
    res.status(200).json({ message: "Style deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting style" });
  }
};

module.exports = {
  getAllStyles,
  getStyleById,
  createStyle,
  updateStyle,
  deleteStyle,
};
