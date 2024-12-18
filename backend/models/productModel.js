const mongoose = require('mongoose')

const schema = mongoose.Schema

const productSchema = new schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String
    },
    description: {
        type: String,
        required: false
    },
    stock: {
        type: Number,
        required: true
    },
    isOutOfStock: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 5 // Default rating if not provided
    },
    sellerId: {
        type: schema.Types.ObjectId,
        ref: 'seller', // Reference to the Seller model
    },
    adminId: {
        type: schema.Types.ObjectId,
        ref: 'Admin', // Reference to the Admin model
    },
    pictures: {
        type: [String], // Array of URLs for pictures
        required: false
    }, // uploaded by the admin , and seller 
    sales: {
        type: Number, // how many times this product was sold
        default : 0
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    reviewsArray: [
        {
          comment: {
            type: String,
            required: false
          },
          touristId: {
            type: schema.Types.ObjectId,
            ref: 'Tourist',  
            required: false
          }
        }
      ],

      numberOfRatings : {
        type : Number,
        default : 1
      },
      touristWhoBoughtSaidProduct:[
        {
            type: schema.Types.ObjectId, ref: 'Tourist' 
          }
          ],
}, { timestamps: true });


module.exports = mongoose.model('product' ,productSchema)