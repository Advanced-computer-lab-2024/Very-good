const mongoose = require('mongoose');
const schema = mongoose.Schema;

// Define Seller schema
const sellerSchema = new schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required
        : true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    IdDocument: {
        type : String, // url of a photo
        required : true
    },
    taxationRegistryCard: {
        type: [String], // Change from String to an array of strings
        required: false
    },
    logo: {
        type : String, // url of a photo
        required : false
    },
    isAccepted: {
        type: String,
        required: false
      },
    acceptedTermsAndConditions :{
        type : Boolean,
        default : false
      },
    createdProducts: [{
        type: schema.Types.ObjectId,
        ref: 'product' // Reference to the Product model
    }]
}, { timestamps: true });

module.exports = mongoose.model('seller' ,sellerSchema)