const { default: mongoose } = require('mongoose')
const Tourist = require('../models/touristModel');
const Itinerary = require('../models/itineraryModel'); // Import your Itinerary model
const TourGuide = require('../models/tourGuideModel')
const Activity = require ('../models/activityModel')
const Product = require ('../models/productModel')
const Seller = require ('../models/sellerModel')
const Admin = require ('../models/adminModel')
const Notification = require ('../models/notificationModel')
const nodemailer = require('nodemailer');

const bookTransportation = async (req, res) => {
  try {
    const { id } = req.params; // Get the tourist ID from the request parameters
    const { transportationId } = req.body; // Get the transportation ID from the request body

    // Find the tourist by ID
    const tourist = await Tourist.findById(id);

    // Check if the tourist was found
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Add the transportation ID to the bookedTransportations array
    tourist.bookedTransportations.push(transportationId);
    
    // Save the updated tourist record back to the database
    await tourist.save();

    // Send a success response
    res.status(200).json({
      message: 'Transportation booked successfully',
      tourist: {
        id: tourist._id,
        bookedTransportations: tourist.bookedTransportations // Optionally return the updated array
      }
    });
  } catch (error) {
    console.error('Error booking transportation:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

removeProductFromWishlist = async (req, res) => {
  try {
      const { touristId, productId } = req.body;

      // Validate input
      if (!touristId || !productId) {
          return res.status(400).json({ message: "Tourist ID and Product ID are required." });
      }

      // Find the tourist and update their wishlist
      const tourist = await Tourist.findById(touristId);
      if (!tourist) {
          return res.status(404).json({ message: "Tourist not found." });
      }

      // Remove the product ID from the wishlist
      tourist.productWishList = tourist.productWishList.filter(
          (wishlistProductId) => wishlistProductId.toString() !== productId
      );

      await tourist.save();

      res.status(200).json({ message: "Product removed from wishlist successfully." });
  } catch (error) {
      console.error("Error removing product from wishlist:", error);
      res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const getWishlistProducts = async (req, res) => {
  const { touristId } = req.body;

  try {
      // Find the tourist by ID
      const tourist = await Tourist.findById(touristId);

      if (!tourist) {
          return res.status(404).json({ message: "Tourist not found" });
      }

      // Fetch products based on product IDs in the productWishList
      const products = await Product.find({
          _id: { $in: tourist.productWishList }
      });

      res.status(200).json({ products });
  } catch (error) {
      console.error("Error fetching wishlist products:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};

const addFlightOfferToTourist = async (req, res) => {
  const { userId, offerId } = req.params; // Assuming userId and offerId are passed as URL parameters

  try {
    // Find the tourist by userId
    const tourist = await Tourist.findById(userId);

    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Add the offerId to the bookedFlightOffers array
    tourist.bookedFlightOffers.push(offerId);

    // Save the updated tourist document
    await tourist.save();

    return res.status(200).json({ message: 'Flight offer added successfully', bookedFlightOffers: tourist.bookedFlightOffers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const addHotelOfferToTourist = async (req, res) => {
  const { userId, offerId } = req.params; // Assuming userId and offerId are passed as URL parameters

  try {
    // Find the tourist by userId
    const tourist = await Tourist.findById(userId);

    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Add the offerId to the bookedFlightOffers array
    tourist.bookedHotelOffers.push(offerId);

    // Save the updated tourist document
    await tourist.save();

    return res.status(200).json({ message: 'Hotel offer added successfully', bookedHotelOffers: tourist.bookedHotelOffers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// get all workout

const createTourist = async (req, res) => {
  try {
    // Destructure the request body to get user details
    const { name, email, password, mobile, nationality, dob, job} = req.body;

    // Create a new user instance with the role of tourist
    const newUser = new Tourist({
      name,
      email,
      password,
      mobile,
      nationality,
      dob,
      job 
      // No need to set bookedItineraries, createdItineraries, or wallet; they will default to appropriate values
    });

    // Save the user to the database
    await newUser.save();

    // Send success response
    res.status(200).json({
      message: 'Tourist created successfully',
      tourist: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        mobile: newUser.mobile,
        nationality: newUser.nationality,
        dob: newUser.dob,
        job: newUser.job,
      }
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(400).json({
      message: 'Error creating tourist',
      error: error.message
    });
  }
};


const getTourist = async (req, res) => {
    try {
        const users = await Tourist.find(); // Fetch all users from the database
        res.status(200).json({
            message: 'Users retrieved successfully',
            data: users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving users',
            error: error.message
        });
    }
};

// get a single workout
const getTouristByEmail = async (req, res) => {
  try {
      // Extract email from the request body
      const { email } = req.body; // Assuming the email is sent in the request body

      // Query the database for the tourist with the given email
      const tourist = await Tourist.findOne({ email: email });

      // Check if the tourist was found
      if (!tourist) {
          return res.status(404).json({
              message: 'Tourist not found'
          });
      }

      // Return the tourist data in JSON format
      res.status(200).json({
          message: 'Tourist retrieved successfully',
          data: tourist
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          message: 'Error retrieving tourist',
          error: error.message
      });
  }
};


// Delete tourist by ID
const deleteTourist = async (req, res) => {
  try {
      const { id } = req.params; // Get the tourist ID from the request parameters

      // Find the tourist and delete them
      const deletedTourist = await Tourist.findByIdAndDelete(id);

      // Check if the tourist was found and deleted
      if (!deletedTourist) {
          return res.status(404).json({ message: 'Tourist not found' });
      }

      res.status(200).json({ message: 'Tourist deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting tourist', error: error.message });
  }
};

const updateRecords = async (req, res) => {
  try {
    const { email, updatedData } = req.body; // Extract email and updated data from the request body

    // Find the tourist by email
    const tourist = await Tourist.findOne({ email: email });

    if (!tourist) {
      // If no tourist is found with the provided email, send an error response
      return res.status(404).json({ error: 'Tourist not found' });
    }

    // Update the tourist's fields with the values from updatedData
    tourist.name = updatedData.name || tourist.name;
    tourist.mobile = updatedData.mobile || tourist.mobile;
    tourist.nationality = updatedData.nationality || tourist.nationality;
    tourist.job = updatedData.job || tourist.job;
    tourist.wallet = updatedData.wallet || tourist.wallet;
    tourist.email=updatedData.email||tourist.email;
    tourist.password=updatedData.password||tourist.password;
    tourist.delete=updatedData.delete||tourist.delete;
    // Any other fields you want to update
    // We are not updating `email` or `password` for security reasons unless explicitly needed

    // Save the updated tourist record back to the database
    const updatedTourist = await tourist.save();

    // Send a success response with the updated tourist data
    res.status(200).json({
      message: 'Tourist updated successfully',
      data: updatedTourist
    });
  } catch (error) {
    console.error('Error updating tourist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// comments methods 
// first we want to fetch all the tourguides a tourist completed a tour with , tour being an actual itnerary 
// to know if a tourist completed the tour or not we will assume that any booked itenaray with the date past , then it must have been attended 
// so what we need here is a method that extracts the email from the request body , seraches the database for that specific instance of the tourist 
// get all booked itneraries where their dates has passed , for each of these itneraries we want to extract their equivalent tour guide responsible for it 

const getPastItinerariesWithTourGuides = async (req, res) => {
  try {
      const { email } = req.body; // Extract email from the request body

      // Find the tourist by email
      const tourist = await Tourist.findOne({ email: email });
      
      if (!tourist) {
          return res.status(404).json({ message: 'Tourist not found' });
      }

      // Get the current date
      const currentDate = new Date();

      // Fetch itineraries based on the IDs in the bookedItineraries array
      const pastItineraries = await Itinerary.find({
          _id: { $in: tourist.bookedItineraries }, // Match itinerary IDs in the bookedItineraries array
          availableDates: { $exists: true, $ne: [] } // Ensure availableDates field exists and is not empty
      });

      // Filter past itineraries based on the last available date
      const filteredPastItineraries = pastItineraries.filter(itinerary => {
        const lastAvailableDate = new Date(Math.max(...itinerary.availableDates.map(date => new Date(date).getTime())));
        return lastAvailableDate < currentDate; // Check if it's in the past
    });

      // Extract tour guide emails from the filtered itineraries
      const tourGuideEmails = await Promise.all(filteredPastItineraries.map(async (itinerary) => {
          const tourGuide = await TourGuide.findById(itinerary.tourGuideId); // Get the tour guide by ID
          return {
            email: tourGuide ? tourGuide.email : null, // Return the email or null if not found
            rating: tourGuide ? tourGuide.rating : null ,// Return the rating or null if not found
            id : tourGuide ? tourGuide._id : null

        };
    }));

      // Filter out any null values in case a tour guide was not found
      const uniqueTourGuideEmails = [...new Set(tourGuideEmails.filter(email => email))];

      // Send the response with the tour guide emails
      res.status(200).json({
          message: 'Past tour guide emails retrieved successfully',
          data: uniqueTourGuideEmails // Send only the unique tour guide emails
      });
  } catch (error) {
      console.error('Error retrieving past itineraries:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


const getPastItinerariesWithTourGuidesForCommentOnItenrary = async (req, res) => {
  // used for if we want to fetch a past itenrary so that we can either comment or rate it  
  // takes an email , of the tourist , returns an array where each element is the folowing info about an itnerary
  // title , tour guide name , rating 
  try {
    const { email } = req.body; // Extract email from the request body

    // Find the tourist by email
    const tourist = await Tourist.findOne({ email: email });
    
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Get the current date
    const currentDate = new Date();

    // Fetch itineraries based on the IDs in the bookedItineraries array
    const pastItineraries = await Itinerary.find({
      _id: { $in: tourist.bookedItineraries }, // Match itinerary IDs in the bookedItineraries array
      availableDates: { $exists: true, $ne: [] } // Ensure availableDates field exists and is not empty
    });

    console.log("Past itineraries:", pastItineraries);

    // Filter past itineraries based on the last available date
    const filteredPastItineraries = pastItineraries.filter(itinerary => {
      const lastAvailableDateTimestamp = Math.max(...itinerary.availableDates.map(date => new Date(date).getTime()));
      const lastAvailableDate = new Date(lastAvailableDateTimestamp);
      
      console.log("Last available date:", lastAvailableDate);
      console.log("Current date:", currentDate);

      return lastAvailableDate < currentDate;
    });

    // Fetch itinerary details and handle missing tour guides
    const itineraryDetails = await Promise.all(
      filteredPastItineraries.map(async (itinerary) => {
        const tourGuide = await TourGuide.findById(itinerary.tourGuideId);
        console.log("Tour guide found:", tourGuide ? tourGuide.name : null);

        return {
          itineraryTitle: itinerary.title,
          tourGuideName: tourGuide ? tourGuide.name : null ,// Return null if tour guide not found
          ratings: itinerary.ratings ,
          id : itinerary.id
        };
      })
    );

    // Send the response including itineraries with `null` tour guide names if necessary
    res.status(200).json({
      message: 'Past itineraries retrieved successfully',
      data: itineraryDetails
    });
  } catch (error) {
    console.error('Error retrieving past itineraries:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


const addItineraryToTourist = async (req, res) => {
  try {
    const { email, itineraryId } = req.body; // Extract email and itineraryId from the request body

    // Find the tourist by email
    const tourist = await Tourist.findOne({ email: email });
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Check if the itinerary already exists in the tourist's booked itineraries
    if (tourist.bookedItineraries.includes(itineraryId)) {
      return res.status(400).json({ message: 'Itinerary is already booked by this tourist' });
    }

    // Add the itinerary ID to the booked itineraries
    tourist.bookedActivities.push(itineraryId);
    
    // Save the updated tourist document
    await tourist.save();

    // Send a success response
    res.status(200).json({ message: 'Itinerary added to tourist successfully', data: tourist.bookedItineraries });
  } catch (error) {
    console.error('Error adding itinerary to tourist:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
const getPastBookedActivities = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the tourist by email and populate bookedActivities with activity details
    const tourist = await Tourist.findOne({ email }).populate('bookedActivities');

    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Helper to zero out time for date-only comparison
    const toDateOnly = date => new Date(date.setHours(0, 0, 0, 0));

    // Get today's date without the time component
    const today = toDateOnly(new Date());

    // Filter activities based on date only, ignoring time
    const pastActivities = tourist.bookedActivities
      .filter(activity => toDateOnly(new Date(activity.date)) < today)
      .map(activity => ({
        name: activity.name,
        ratings: activity.ratings,
        id : activity._id
      }));

    res.status(200).json({
      message: 'Past activities retrieved successfully',
      pastActivities
    });
  } catch (error) {
    console.error('Error fetching past activities:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


const rateTourGuide = async (req, res) => {
  try {
    const {email, rating } = req.body; // Extract IDs and rating from the request body

    // Find the tourist and tour guide by their IDs
    const tourGuide = await TourGuide.findOne({ email });

    if (!tourGuide) {
      return res.status(404).json({ message: 'Tour guide not found' });
    }

    // Ensure rating is between 1 and 5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Update the tour guide's rating
    tourGuide.rating = ((tourGuide.rating * tourGuide.numberOfRatings) + rating) / (tourGuide.numberOfRatings + 1);
    tourGuide.numberOfRatings += 1;
    
    await tourGuide.save();

    res.status(200).json({
      message: 'Tour guide rated successfully',
      tourGuideRating: tourGuide.rating
    });
  } catch (error) {
    console.error('Error rating tour guide:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const rateActivity = async (req, res) => {
  try {
    const { activityname, rating } = req.body; // Extract IDs and rating from the request body

    // Find the tourist and itinerary by their IDs
    const activity = await Activity.findOne({ name: activityname });
    if (!activity) {
      return res.status(404).json({ message: 'activity not found' });
    }

    // Ensure rating is between 1 and 5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Update the itinerary's rating
    activity.ratings = ((activity.ratings * activity.numberOfRatings) + rating) / (activity.numberOfRatings + 1);
    activity.numberOfRatings += 1;
    
    await activity.save();

    res.status(200).json({
      message: 'Itinerary rated successfully',
      activity: activity.ratings
    });
  } catch (error) {
    console.error('Error rating itinerary:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};






const rateItinerary = async (req, res) => {
  try {
    const { itineraryId, rating } = req.body; // Extract IDs and rating from the request body

    // Find the tourist and itinerary by their IDs
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    // Ensure rating is between 1 and 5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Update the itinerary's rating
    itinerary.ratings = ((itinerary.ratings * itinerary.numberOfRatings) + rating) / (itinerary.numberOfRatings + 1);
    itinerary.numberOfRatings += 1;
    
    await itinerary.save();

    res.status(200).json({
      message: 'Itinerary rated successfully',
      itineraryRating: itinerary.ratings
    });
  } catch (error) {
    console.error('Error rating itinerary:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const purchaseProductbck = async ({ email, productId, credit, promoCodePercentage = 0 }) => {
  try {
    const tourist = await Tourist.findOne({ email: email });
    if (!tourist) {
      throw new Error('Tourist not found');
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    if (product.stock <= 0) {
      throw new Error('Product is out of stock');
    }

    let finalPrice = product.price;

    if (promoCodePercentage > 0) {
      finalPrice -= (finalPrice * promoCodePercentage) / 100;
    }

    // Ensure final price is non-negative
    finalPrice = Math.max(finalPrice, 0);

    // Check if the tourist has enough funds
    if (!credit && tourist.wallet < finalPrice) {
      throw new Error('Insufficient funds in wallet');
    }

    // Deduct price from wallet if not using credit
    if (!credit) {
      tourist.wallet -= finalPrice;
    }

    if (!tourist.purchasedProducts.includes(productId)) {
      tourist.purchasedProducts.push(productId);
    }

    if (product.stock > 0) {
      product.stock -= 1;
    }

    if (product.stock === 0 && !product.isOutOfStock) {
      const sellerId = product.sellerId;
      await sendMailToSeller(sellerId, product);
      await notifyAdmins(product);
      product.isOutOfStock = true;
    }

    if (!product.touristWhoBoughtSaidProduct.includes(tourist._id)) {
      product.touristWhoBoughtSaidProduct.push(tourist._id);
    }

    await updateLoyaltyPoints(tourist._id, product.price);

    await tourist.save();
    await product.save();

    return { success: true };
  } catch (error) {
    console.error('Error purchasing product:', error.stack);
    return { success: false, error: error.message };
  }
};

const CreateAndReturnOrderArray = async (req, res) => {
  const { touristId } = req.params;
  const { credit, promoCodePercentage } = req.body;
  console.log("credit : ", credit);

  try {
    if (!mongoose.Types.ObjectId.isValid(touristId)) {
      return res.status(400).send({ error: 'Invalid tourist ID' });
    }

    const tourist = await Tourist.findById(touristId).exec();
    if (!tourist) {
      return res.status(404).send({ error: 'Tourist not found' });
    }

    const cart = tourist.cart;
    console.log('Tourist Cart:', cart);

    if (!cart || cart.length === 0) {
      const updatedTourist = await Tourist.findById(touristId)
        .populate({
          path: 'ordersMahmoudBidoAlliance.products',
        })
        .exec();

      return res.json(updatedTourist.ordersMahmoudBidoAlliance);
    }

    const products = [];
    for (const productId of cart) {
      const product = await Product.findById(productId).lean();
      if (product) {
        products.push(product);
      }
    }

    if (products.length === 0) {
      return res.status(404).send({ error: 'No products found in cart' });
    }

    console.log('Products in Cart:', products);

    for (const product of products) {
      const result = await purchaseProductbck({ email: tourist.email, productId: product._id, credit: credit, promoCodePercentage: promoCodePercentage });
      if (!result.success) {
        return res.status(500).send({ error: `Failed to purchase product: ${product.name}` });
      }
    }

    const currentDate = new Date();
    tourist.ordersMahmoudBidoAlliance.forEach(order => {
      const daysDifference = Math.floor((currentDate - order.orderDate) / (1000 * 60 * 60 * 24));
      order.status = daysDifference > 2 ? 'delivered' : 'not delivered';
    });

    const totalPrice = products.reduce((total, product) => total + product.price, 0);

    const newOrder = {
      orderDate: new Date(),
      products: products.map(product => product._id),
      totalPrice,
      status: 'not delivered'
    };

    await tourist.save();

    await Tourist.findByIdAndUpdate(touristId, {
      $push: { ordersMahmoudBidoAlliance: newOrder },
      $set: { cart: [] }
    });

    console.log('New Order:', newOrder);

    const updatedTourist = await Tourist.findById(touristId)
      .populate({
        path: 'ordersMahmoudBidoAlliance.products',
      })
      .exec();

    return res.json(updatedTourist.ordersMahmoudBidoAlliance);

  } catch (error) {
    console.error('Error creating and returning order array:', error);
    return res.status(500).send({ error: 'An error occurred while processing the order' });
  }
};

const notifyAdmins = async (product) => {
  const admins = await Admin.find({});
  const adminEmails = admins.map(admin => admin.email);

  const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
      }
  });

  const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmails,
      subject: 'Product Out of Stock Notification',
      text: `The product with name ${product.name} and ID ${product._id} is out of stock.`
  };

  await transporter.sendMail(mailOptions);
};

const sendMailToSeller = async (sellerId, product) => {
  const seller = await Seller.findById(sellerId);
  if (!seller) {
      console.error('Seller not found');
      return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
      from: process.env.EMAIL_USER,
      to: seller.email,
      subject: "Product is out of stock",
      text: `Your product ${product.name} with id : ${product._id} is out of stock`,
  };

  await transporter.sendMail(mailOptions);
}

const getPurchasedProducts = async (req, res) => {
  try {
      const { email } = req.query; // Extract the tourist email

      // Find the tourist by email
      const tourist = await Tourist.findOne({ email: email });

      if (!tourist) {
          return res.status(404).json({ message: 'Tourist not found' });
      }

      // Fetch the products that the tourist has purchased
      
      const purchasedProducts = await Product.find({
          _id: { $in: tourist.purchasedProducts } // Match product IDs in the purchasedProducts array
      });
      console.log(purchasedProducts);

      res.status(200).json({
          message: 'Purchased products retrieved successfully',
          data: purchasedProducts
      });
  } catch (error) {
      console.error('Error fetching purchased products:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const rateProduct = async (req, res) => {
  try {
    const { productId, rating } = req.body; // Get product ID and rating from the request body

    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 0 and 5' });
    }

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Calculate new rating and update the product's numberOfRatings
    const newRating = (product.rating * product.numberOfRatings + rating) / (product.numberOfRatings + 1);

    // Update product's ratings and numberOfRatings
    product.rating = newRating;
    product.numberOfRatings += 1;

    // Save the updated product
    await product.save();

    res.status(200).json({
      message: 'Product rated successfully',
      data: {
        rating: product.rating,
        numberOfRatings: product.numberOfRatings
      }
    });
  } catch (error) {
    console.error('Error rating product:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const makePayment = async (req, res) => {
  try {
      const { id } = req.params; // Tourist ID from the URL
      const { amountPaid } = req.body; // Amount paid from the request body
      if (isNaN(amountPaid)) {
        console.error('Invalid amountPaid:', amountPaid);
        //throw new Error('Invalid amountPaid value.');
      }
      else {
        console.error("amount paid tele3 rakm")
      }
      // Update loyalty points and level based on payment
      const updatedTourist = await updateLoyaltyPoints(id, amountPaid);

      res.status(200).json({
          message: 'Payment successful, loyalty points updated',
          updatedTourist
      });
  } catch (error) {
      console.error('Error processing payment:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
// Update loyalty points and level
const updateLoyaltyPoints = async (touristId, amountPaid) => {
  try {
      const tourist = await Tourist.findById(touristId);
      if (!tourist) throw new Error("Tourist not found");

      // Check tourist level validity
      if (![1, 2, 3].includes(tourist.level)) {
          console.error('Invalid tourist level:', tourist.level);
          tourist.level = 1; // default to level 1
      }

      let pointsToAdd;
      if (tourist.level === 1) pointsToAdd = amountPaid * 0.5;
      else if (tourist.level === 2) pointsToAdd = amountPaid * 1;
      else if (tourist.level === 3) pointsToAdd = amountPaid * 1.5;

      console.log('Points to add:', pointsToAdd);
      if (isNaN(pointsToAdd)) {
          console.error('Calculated points are NaN:', pointsToAdd);
          pointsToAdd = 0; // Default to 0 to avoid NaN errors
      }

      // Ensure loyaltyPoints is a valid number
      tourist.loyaltyPoints = isNaN(tourist.loyaltyPoints) ? 0 : tourist.loyaltyPoints;
      tourist.loyaltyPoints += pointsToAdd;

      // Determine the new level based on loyalty points
      if (tourist.loyaltyPoints > 500000) {
          tourist.level = 3;
          tourist.badge = "Gold";
      } else if (tourist.loyaltyPoints > 100000) {
          tourist.level = 2;
          tourist.badge = "Silver";
      } else {
          tourist.level = 1;
          tourist.badge = "Bronze";
      }

      await tourist.save();
      return tourist;
  } catch (error) {
      console.error('Error updating loyalty points:', error);
      throw error;
  }
};

const redeemPoints = async (req, res) => {
  try {
    const { id } = req.params; // Tourist ID from the URL
    const { pointsToRedeem } = req.body; // Points to redeem sent in the request body

    const tourist = await Tourist.findById(id);
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Check if tourist has enough points
    if (tourist.loyaltyPoints < pointsToRedeem) {
      return res.status(400).json({ message: 'Not enough points to redeem' });
    }

    // Calculate the cash value of the points (10,000 points = 100 EGP)
    const exchangeRate = 10000; // 10,000 points = 100 EGP
    const cashAmount = (pointsToRedeem / exchangeRate) * 100;

    // Update the tourist's wallet and loyalty points
    tourist.wallet += cashAmount; // Add the equivalent cash to the wallet
    tourist.loyaltyPoints -= pointsToRedeem; // Subtract the redeemed points

    // Save the updated tourist data
    await tourist.save();

    // Return the updated tourist data
    res.status(200).json({
      message: 'Points redeemed successfully!',
      tourist,
    });
  } catch (error) {
    console.error('Error redeeming points:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const makePayment2 = async (req, res) => {
  try {
      const { id } = req.params; // Tourist ID from the URL
      const { amountPaid } = req.body; // Amount paid from the request body
      if (isNaN(amountPaid)) {
        console.error('Invalid amountPaid:', amountPaid);
        //throw new Error('Invalid amountPaid value.');
      }
      else {
      }
      // Update loyalty points and level based on payment
      console.log("ablawait loyalty2")
      const updatedTourist = await updateLoyaltyPoints2(id, amountPaid);
      console.log("b3dawait loyalty2")
      res.status(200).json({
          message: 'Payment successful, loyalty points updated',
          updatedTourist
      });
  } catch (error) {
      console.error('Error processing payment:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
// Update loyalty points and level
const updateLoyaltyPoints2 = async (touristId, amountPaid) => {
  try {
    console.log("d5lna makepayment22")
      const tourist = await Tourist.findById(touristId);
      if (!tourist) throw new Error("Tourist not found");

      if(tourist.wallet < amountPaid)
        throw new Error("not enough money in wallet");

      tourist.wallet -= amountPaid;
      
      // Check tourist level validity
      if (![1, 2, 3].includes(tourist.level)) {
          console.error('Invalid tourist level:', tourist.level);
          tourist.level = 1; // default to level 1
      }

      let pointsToAdd;
      if (tourist.level === 1) pointsToAdd = amountPaid * 0.5;
      else if (tourist.level === 2) pointsToAdd = amountPaid * 1;
      else if (tourist.level === 3) pointsToAdd = amountPaid * 1.5;

      console.log('Points to add:', pointsToAdd);
      if (isNaN(pointsToAdd)) {
          console.error('Calculated points are NaN:', pointsToAdd);
          pointsToAdd = 6; // Default to 0 to avoid NaN errors
      }

      // Ensure loyaltyPoints is a valid number
      tourist.loyaltyPoints = isNaN(tourist.loyaltyPoints) ? 0 : tourist.loyaltyPoints;
      tourist.loyaltyPoints += pointsToAdd;

      // Determine the new level based on loyalty points
      if (tourist.loyaltyPoints > 500000) {
          tourist.level = 3;
          tourist.badge = "Gold";
      } else if (tourist.loyaltyPoints > 100000) {
          tourist.level = 2;
          tourist.badge = "Silver";
      } else {
          tourist.level = 1;
          tourist.badge = "Bronze";
      }

      await tourist.save();
      return tourist;
  } catch (error) {
      console.error('Error updating loyalty points:', error);
      throw error;
  }
};

const addProductToWishlist = async (req, res) => {
  const { touristId, productId } = req.body; // Extract touristId and productId from the request body

  if (!touristId || !productId) {
    return res.status(400).json({ message: "touristId and productId are required." });
  }

  try {
    // Find the tourist by ID and add the productId to the productWishList array if not already present
    const updatedTourist = await Tourist.findByIdAndUpdate(
      touristId,
      { $addToSet: { productWishList: productId } }, // $addToSet ensures no duplicates
      { new: true } // Return the updated document
    );

    if (!updatedTourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }

    res.status(200).json({
      message: "Product added to wishlist successfully.",
      tourist: updatedTourist,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while adding the product to the wishlist." });
  }
};

const addProductToCard = async (req, res) => {
  const { touristId, productId } = req.body; // Extract touristId and productId from the request body

  if (!touristId || !productId) {
    return res.status(400).json({ message: "touristId and productId are required." });
  }

  try {
    // Find the tourist by ID and add the productId to the productWishList array if not already present
    const updatedTourist = await Tourist.findByIdAndUpdate(
      touristId,
      { $push: { cart: productId } }, // $addToSet ensures no duplicates , i removed and made it simply push 
      { new: true } // Return the updated document
    );

    if (!updatedTourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }

    res.status(200).json({
      message: "Product added to cart successfully.",
      tourist: updatedTourist,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while adding the product to the cart." });
  }
};

const getItinerariesForTourist = async (req, res) => {
  try {
    const { email } = req.params;

    // Find the tourist by email and populate bookedItineraries with itinerary details
    const tourist = await Tourist.findOne({ email }).populate('bookedItineraries');

    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    res.status(200).json({
      message: 'Itineraries retrieved successfully',
      itineraries: tourist.bookedItineraries
    });
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const getActivitiesForTourist = async (req, res) => {
  try {
    const { email } = req.params;

    // Find the tourist by email and populate bookedActivities with activity details
    const tourist = await Tourist.findOne({ email }).populate('bookedActivities');

    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    res.status(200).json({
      message: 'Activities retrieved successfully',
      activities: tourist.bookedActivities
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const bookmarkActivity = async (req, res) => {
  try {
    const { email, activityId } = req.body;

    // Find the tourist by email
    const tourist = await Tourist.findOne({ email });
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Add the activity ID to the bookmarkedActivities array if not already present
    if (!tourist.bookmarkedActivities.includes(activityId)) {
      tourist.bookmarkedActivities.push(activityId);
      await tourist.save();
    }

    res.status(200).json({
      message: 'Activity bookmarked successfully',
      bookmarkedActivities: tourist.bookmarkedActivities
    });
  } catch (error) {
    console.error('Error bookmarking activity:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const getBookmarkedActivities = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the tourist by email and populate bookmarkedActivities with activity details
    const tourist = await Tourist.findOne({ email }).populate('bookmarkedActivities');

    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    res.status(200).json({
      message: 'Bookmarked activities retrieved successfully',
      bookmarkedActivities: tourist.bookmarkedActivities
    });
  } catch (error) {
    console.error('Error fetching bookmarked activities:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const getTouristById = async (req, res) => {
  try {
    const { ids } = req.query; // Get the ids from the query parameter
    const touristData = await Tourist.find({ '_id': { $in: ids } });
    res.status(200).json(touristData);
  } catch (error) {
    console.error("Error retrieving tourists:", error);
    res.status(500).json({ message: "Error retrieving tourists", error: error.message });
  }
};
const addDeliveryAddress = async (req, res) => {
  try {
    console.log('Add Delivery Address function invoked');
    
    const touristId = req.params.touristId;  // Extract touristId from the request params
    const { addresses } = req.body;  // Extract the addresses from the request body

    // Validate addresses: it should be a string or an array of strings
    if (!addresses || (Array.isArray(addresses) && addresses.length === 0) || typeof addresses !== 'string' && !Array.isArray(addresses)) {
      return res.status(400).json({ error: 'Addresses are required and must be a string or an array of strings' });
    }

    // If the addresses is a single string, convert it to an array
    const addressesArray = Array.isArray(addresses) ? addresses : [addresses];

    console.log('Adding these addresses:', addressesArray);  // Log to check the addresses

    // Find the tourist by their ID
    const tourist = await Tourist.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ error: 'Tourist not found' });
    }

    // Initialize deliveryAdresses if it doesn't exist
    if (!tourist.deliveryAdresses) {
      tourist.deliveryAdresses = [];
    }

    // Add the new addresses to the tourist's deliveryAdresses list
    tourist.deliveryAdresses.push(...addressesArray);
    console.log('Updated deliveryAdresses:', tourist.deliveryAdresses);  // Log the updated addresses

    // Log tourist object before saving
    console.log('Tourist object before saving:', tourist);

    // Save the updated tourist document
    await tourist.save();

    // Log tourist object after saving to check if changes are persisted
    const updatedTourist = await Tourist.findById(touristId);
    console.log('Tourist object after saving:', updatedTourist);

    res.status(200).json({ message: 'Addresses added successfully', tourist: updatedTourist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while adding the addresses', details: error.message });
  }
};
const getDeliveryAddresses = async (req, res) => {
  try {
    const touristId = req.params.touristId;  // Extract touristId from the request params

    // Find the tourist by their ID
    const tourist = await Tourist.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ error: 'Tourist not found' });
    }

    // Ensure you are accessing the correct field name, which is 'deliveryAdresses'
    const deliveryAddresses = Array.isArray(tourist.deliveryAdresses) ? tourist.deliveryAdresses : [];

    // Respond with the list of delivery addresses
    res.status(200).json({
      message: 'Success',
      addresses: deliveryAddresses  // This will send the addresses back correctly
    });
  } catch (error) {
    console.error('Error fetching delivery addresses:', error);
    res.status(500).json({
      error: 'An error occurred while fetching delivery addresses',
      details: error.message
    });
  }
};
const viewCart = async (req, res) => {
  const { touristId } = req.params; // Get the touristId from the request params

  try {
    // Fetch the tourist document, populate the 'cart' field to get product details
    const tourist = await Tourist.findById(touristId)
      .populate({
        path: 'cart', // This will populate the products in the 'cart' field
        select: 'name price stock description pictures' // Choose fields you want to return
      })
      .exec();

    // Check if the tourist was found
    if (!tourist) {
      return res.status(404).json({ error: 'Tourist not found' });
    }

    // Return the populated cart with product details
    res.status(200).json(tourist.cart); // The cart now contains populated products
  } catch (error) {
    console.error('Error viewing cart:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
// do we build a method that empties out the cart ? , the method createAndReturn Does in fact delete the cart and this method would be called upon check out 
  // all we should do is a method that given a touristId and a product Id Removes that product ,
  const removeProductFromCart = async (req, res) => {
    const { touristId, productId } = req.params; // Get touristId and productId from the request params
  
    try {
      // Find the tourist by ID
      const tourist = await Tourist.findById(touristId);
  
      // If the tourist doesn't exist, return an error
      if (!tourist) {
        return res.status(404).json({ error: 'Tourist not found' });
      }
  
      // Check if the product exists in the cart
      const productIndex = tourist.cart.indexOf(productId);
  
      // If the product is not in the cart, return an error
      if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found in cart' });
      }
  
      // Remove only one instance of the product from the cart
      tourist.cart.splice(productIndex, 1); // Removes one product at the found index
  
      // Save the updated tourist document
      const updatedTourist = await tourist.save();
  
      // Return the updated cart array
      res.status(200).json({
        message: 'Product removed from cart successfully',
        updatedCart: updatedTourist.cart, // Return the updated cart array
      });
    } catch (error) {
      console.error('Error removing product from cart:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  

const viewOrders = async (req, res) => {
  const { touristId } = req.params;

  try {
    // Validate the touristId
    if (!mongoose.Types.ObjectId.isValid(touristId)) {
      return res.status(400).send({ error: 'Invalid tourist ID' });
    }

    // Fetch the tourist document and populate the orders
    const tourist = await Tourist.findById(touristId)
      .populate({
        path: 'ordersMahmoudBidoAlliance.products', // Populate the product details in each order
      })
      .exec();

    if (!tourist) {
      return res.status(404).send({ error: 'Tourist not found' });
    }

    // Return the populated orders
    return res.json(tourist.ordersMahmoudBidoAlliance);
  } catch (error) {
    console.error('Error viewing orders:', error);
    return res.status(500).send({ error: 'An error occurred while viewing the orders' });
  }
};

// Controller to delete an order by ID
const deleteOrder = async (req, res) => {
  const { touristId, orderId } = req.params;

  try {
    // Find the tourist and locate the order to be deleted
    const tourist = await Tourist.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Find the order to retrieve its totalPrice
    const orderToDelete = tourist.ordersMahmoudBidoAlliance.find(
      (order) => order._id.toString() === orderId
    );

    if (!orderToDelete) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Add the order's totalPrice back to the wallet
    tourist.wallet += orderToDelete.totalPrice;

    // Remove the order from the orders array
    tourist.ordersMahmoudBidoAlliance = tourist.ordersMahmoudBidoAlliance.filter(
      (order) => order._id.toString() !== orderId
    );

    // Save the updated tourist document
    await tourist.save();

    res.status(200).json({
      message: 'Order deleted successfully, wallet updated',
      updatedOrders: tourist.ordersMahmoudBidoAlliance,
      wallet: tourist.wallet,
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};




const deleteAllTourists = async (req, res) => {
  try {
    console.log('deleteAllTourists function called'); // Add logging
    const result = await Tourist.deleteMany({});
    console.log('Deletion result:', result); // Log the result of the deletion
    res.status(200).json({ message: 'All tourists deleted successfully' });
  } catch (error) {
    console.error('Error deleting all tourists:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = {createTourist, getTourist,getTouristByEmail, updateRecords ,deleteTourist, bookTransportation, addFlightOfferToTourist, addHotelOfferToTourist,getPastItinerariesWithTourGuides,
  getPastItinerariesWithTourGuidesForCommentOnItenrary,addItineraryToTourist,getPastBookedActivities, rateTourGuide, rateItinerary, purchaseProductbck, getPurchasedProducts, rateProduct,updateLoyaltyPoints,redeemPoints,makePayment,rateActivity,makePayment2,updateLoyaltyPoints2, addProductToWishlist, getWishlistProducts, removeProductFromWishlist, addProductToCard, getItinerariesForTourist, getActivitiesForTourist, bookmarkActivity, getBookmarkedActivities, getTouristById, deleteAllTourists,addDeliveryAddress,getDeliveryAddresses,CreateAndReturnOrderArray,deleteOrder,viewCart,removeProductFromCart,viewOrders}