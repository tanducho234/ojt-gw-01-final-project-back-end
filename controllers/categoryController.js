// controllers/categoryController.js
const Category = require("../models/Category"); // Assuming you have a Category model

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find(); // Find all categories in the database
    res.status(200).json(categories); // Return the categories as a JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving categories" });
  }
};

// Get category by ID
const getCategoryById = async (req, res) => {
  const { id } = req.params; // Extract ID from URL params
  try {
    const category = await Category.findById(id); // Find the category by ID
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category); // Return the category as a JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving category" });
  }
};

// Create a new category
const createCategory = async (req, res) => {
  const { name, description, imgLink } = req.body; // Assuming name and description are required
  try {
    const newCategory = new Category({
      name,
      description,
      imgLink,
    });

    await newCategory.save(); // Save the category to the database
    res.status(201).json(newCategory); // Return the newly created category
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error creating category" });
  }
};

// Update an existing category
const updateCategory = async (req, res) => {
  const { id } = req.params; // Extract ID from URL params
  const { name, description, imgLink } = req.body; // Assuming name and description are passed to update
  try {
    console.log(imgLink,name)
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, description, imgLink },
      { new: true } // This ensures that the updated document is returned
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(updatedCategory); // Return the updated category
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error updating category" });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  const { id } = req.params; // Extract ID from URL params
  try {
    const deletedCategory = await Category.findByIdAndDelete(id); // Delete the category by ID
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting category" });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
