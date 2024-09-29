const Tag = require('../models/tagModel');

const createTag = async (req, res) => {
    try {
        // Destructure the request body to get seller details
        const { name, tourismGovernerId} = req.body;

        const newTag = new Tag({
            name,
            tourismGovernerId
        });

        await newTag.save();

        // Send success response
        res.status(201).json({
            message: 'Tag created successfully',
            seller: {
                id: newTag._id,
                tourismGovernerId: newTag.tourismGovernerId,
            }
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(400).json({
            message: 'Error creating Tag',
            error: error.message
        });
    }
};

// Get all Sellers
const getTags = async (req, res) => {
    try {
        const tags = await Tag.find(); // Fetch all Sellers from the database
        res.status(200).json({
            message: 'Tags retrieved successfully',
            data: tags
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving Tags',
            error: error.message
        });
    }
};

module.exports = {createTag, getTags}
