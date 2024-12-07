const Admin = require('../models/adminModel');
const { default: mongoose } = require('mongoose')
const Itinerary = require('../models/itineraryModel'); // Ensure this is the correct path for the Itinerary model
const Tourist = require('../models/touristModel');
const TourGuide = require('../models/tourGuideModel');
const TourismGoverner = require('../models/tourismGovernerModel');
const Advertiser = require('../models/advertiserModel');
const Seller = require('../models/sellerModel');
const Product = require('../models/productModel'); // Ensure this is the correct path for the Product model

const checkAdmin = async (req, res) => {

}



const createAdmin = async (req, res) => {
    try {
      // Destructure the request body to get user details
      const { name, email, password, mobile} = req.body;
  
      // Create a new user instance with the role of tourist
      const admin = new Admin({
        name,
        email,
        password,
        mobile
        // No need to set bookedItineraries, createdItineraries, or wallet; they will default to appropriate values
      });
  
      // Save the user to the database
      await admin.save();
  
      // Send success response
      res.status(200).json({
        message: 'Admin created successfully',
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          mobile: admin.mobile
        }
      });
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(400).json({
        message: 'Error creating admin',
        error: error.message
      });
    }
};

const flagItinerary = async (req, res) => {
    try {
        const { id } = req.params; // Ensure you're using 'id' here
        console.log(`Request received to flag itinerary with ID: ${id}`);
        
        const itinerary = await Itinerary.findById(id);
        if (!itinerary) {
            console.log(`Itinerary with ID ${id} not found`);
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        itinerary.flagged = !itinerary.flagged; // Toggle flag status
        await itinerary.save();

        return res.status(200).json({ message: 'Itinerary flag status updated', itinerary });
    } catch (error) {
        console.error('Error flagging itinerary:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
};

const getUserStatistics = async (req, res) => {
    try {
        const [tourists, tourGuides, tourismGoverners, advertisers, sellers] = await Promise.all([
            Tourist.find({}),
            TourGuide.find({}),
            TourismGoverner.find({}),
            Advertiser.find({}),
            Seller.find({})
        ]);

        const totalUsers = tourists.length + tourGuides.length + tourismGoverners.length + advertisers.length + sellers.length;

        const months = Array(12).fill(0);
        const allUsers = [...tourists, ...tourGuides, ...tourismGoverners, ...advertisers, ...sellers];
        allUsers.forEach(user => {
            const month = new Date(user.createdAt).getMonth();
            months[month]++;
        });

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const userStats = { total: totalUsers };
        monthNames.forEach((month, index) => {
            userStats[month] = months[index];
        });

        res.status(200).json(userStats);
    } catch (error) {
        console.error('Error fetching user statistics:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({});
    res.status(200).json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ message: 'Server error', error });
  }
}

const getAdminByEmail = async (req, res) => {
    try {
        const { adminEmail } = req.body;
        const admin = await Admin.findOne({ email: adminEmail });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json(admin);
    } catch (error) {
        console.error('Error fetching admin by email:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, price, sellerId, stock } = req.body;

        const product = new Product({
            name,
            description,
            price,
            adminId: sellerId, // Save sellerId as adminId,
            stock
        });

        await product.save();

        res.status(201).json({
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = { 
    checkAdmin, 
    createAdmin, 
    getAdmins, 
    flagItinerary, 
    getUserStatistics, 
    getAdminByEmail,
    createProduct // Export the new function
};