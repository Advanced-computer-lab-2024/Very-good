const Tag = require('../models/tagModel'); // Ensure you have the correct model imported

// Create a new tag
const createTag = async (req, res) => {
    try {
        const { name, tourismGovernerId, category } = req.body;

        

        const newTag = new Tag({
            name,
            tourismGovernerId,
            category
        });

        await newTag.save();

        res.status(201).json({
            message: 'Tag created successfully',
            tag: {
                id: newTag._id,
                name: newTag.name,
                tourismGovernerId: newTag.tourismGovernerId,
                category: newTag.category
            }
        });
    } catch (error) {
        console.error('Error creating tag:', error);
        res.status(500).json({
            message: 'Error creating tag',
            error: error.message
        });
    }
};

// Get all tags
const getTags = async (req, res) => {
    try {
        const tags = await Tag.find().populate('tourismGovernerId', 'name email');
        res.status(200).json({
            message: 'Tags retrieved successfully',
            data: tags
        });
    } catch (error) {
        console.error('Error retrieving tags:', error);
        res.status(500).json({
            message: 'Error retrieving tags',
            error: error.message
        });
    }
};

// Update an existing tag
const updateTag = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTag = await Tag.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedTag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        res.status(200).json({
            message: 'Tag updated successfully',
            tag: updatedTag
        });
    } catch (error) {
        console.error('Error updating tag:', error);
        res.status(500).json({
            message: 'Error updating tag',
            error: error.message
        });
    }
};

// Delete an existing tag
const deleteTag = async (req, res) => {
    try {
        const { id } = req.params; // Get the tag ID from the request parameters
        const deletedTag = await Tag.findByIdAndDelete(id); // Delete the tag

        if (!deletedTag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        res.status(200).json({
            message: 'Tag deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting tag:', error);
        res.status(500).json({
            message: 'Error deleting tag',
            error: error.message
        });
    }
};

module.exports = { createTag, getTags, updateTag, deleteTag };