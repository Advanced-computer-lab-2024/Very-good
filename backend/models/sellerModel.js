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
        required : false //changed from true
    },
    taxationRegistryCard: {
      type : String, // url of a photo
      required : false //changed from true
    },
    logo: {
        type : String, // url of a photo
        required : false //changed from true
    },
    isAccepted: {
        type: String,
        required : false //changed from true
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