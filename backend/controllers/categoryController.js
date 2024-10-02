const { default: mongoose } = require('mongoose')
const Category = require('../models/categoryModel')

const createCategory = async (req, res) => {
    try {
      const newCategory = new Category(req.body);
      const savedCategory = await newCategory.save();
      res.status(201).json({
        message: 'Category created successfully',
        category: savedCategory // Ensure this is the expected structure
      });
    } catch (error) {
      res.status(500).json({ message: 'Error creating category', error });
    }
  };
  
  

const getCategories = async (req, res) => {
    try {
        const Categories = await Category.find(); // Fetch all Categories from the database
        res.status(200).json({
            message: 'Categories retrieved successfully',
            data: Categories
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving Categories',
            error: error.message
        });
    }
}
const deleteCategory = async (req, res) => {
    const categoryName = req.params.name; // Get the category name from the route parameters
    try {
      const deletedCategory = await Category.findOneAndDelete({ name: categoryName }); // Delete by name
      if (!deletedCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
const updateCategory = async (req, res) => {
    const { categoryName } = req.params; // Get the category name from the route parameters
  const updatedData = req.body; // Get the updated data from the request body

  try {
    const updatedCategory = await Category.findOneAndUpdate(
      { name: categoryName },
      updatedData,
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({
      message: 'Category updated successfully',
      category: updatedCategory
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }

};

module.exports = {createCategory, getCategories,deleteCategory, updateCategory}