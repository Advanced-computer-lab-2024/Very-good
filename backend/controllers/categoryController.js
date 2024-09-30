const { default: mongoose } = require('mongoose')
const Category = require('../models/categoryModel')

const createCategory = async (req, res) => {
    try {
        const { name} = req.body;

        const newCategory = new Category({
            name
        
    });
    await newCategory.save();


    // Send success response
    res.status(200).json({
        message: 'Category created successfully',
        category: {
            id: newCategory._id,
            name: newCategory.name,
            
        }
    });
} catch (error) {
    // Handle errors
    console.error(error);
    res.status(400).json({
        message: 'Error creating Category',
        error: error.message
    });
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
    try {
        const  id  = req.body; // Get the user ID from request params
  
        // Find the user by ID and delete
        const deletedCategory = await Category.findByIdAndDelete(id);
  
        if (!deletedCategory) {
           return res.status(404).json({ message: "Category not found" });
        }
  
        res.status(200).json({
           message: "Category deleted successfully",
           Category: deletedCategory
        });
     } catch (error) {
        res.status(500).json({
           message: "Error deleting Category",
           error: error.message
        });
     }
}
const updateCategory = async (req, res) => {
    try {
        const { id, name } = req.body;
    
        if (!id) {
          return res.status(400).json({ message: 'Category ID is required' });
        }
    
        // Find user by ID and update with new data
        const updatedCategory= await Category.findByIdAndUpdate(id, { name }, { new: true });
    
        // Check if the user exists
        if (!updatedCategory) {
          return res.status(404).json({ message: 'Category not found' });
        }
    
        // Return success response
        res.status(200).json({ message: 'Category updated successfully', Category: updatedCategory });
      } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Error updating Category', error: error.message });
      }
}