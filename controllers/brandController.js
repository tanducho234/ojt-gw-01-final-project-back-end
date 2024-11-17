// controllers/brandController.js
const Brand = require("../models/Brand"); // Assuming you have a Brand model

// Get all brands
const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find(); // Find all brands in the database
    res.status(200).json(brands); // Return the brands as a JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving brands" });
  }
};

// Get brand by ID
const getBrandById = async (req, res) => {
  const { id } = req.params; // Extract ID from URL params
  try {
    const brand = await Brand.findById(id); // Find the brand by ID
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.status(200).json(brand); // Return the brand as a JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving brand" });
  }
};

// Create a new brand
const createBrand = async (req, res) => {
  const { name, description,imgLink } = req.body; // Assuming name and description are required
  try {
    const newBrand = new Brand({
      name,
      description,
      imgLink
    });

    await newBrand.save(); // Save the brand to the database
    res.status(201).json(newBrand); // Return the newly created brand
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error creating brand" });
  }
};

// Update an existing brand
const updateBrand = async (req, res) => {
  const { id } = req.params; // Extract ID from URL params
  const { name, description } = req.body; // Assuming name and description are passed to update
  try {
    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      { name, description },
      { new: true } // This ensures that the updated document is returned
    );

    if (!updatedBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    res.status(200).json(updatedBrand); // Return the updated brand
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error updating brand" });
  }
};

// Delete a brand
const deleteBrand = async (req, res) => {
  const { id } = req.params; // Extract ID from URL params
  try {
    const deletedBrand = await Brand.findByIdAndDelete(id); // Delete the brand by ID
    if (!deletedBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting brand" });
  }
};

module.exports = {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
};
