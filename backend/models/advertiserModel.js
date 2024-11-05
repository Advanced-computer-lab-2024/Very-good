const mongoose = require('mongoose')

const schema = mongoose.Schema

const advertiserSchema = new schema({

    name: {
        type: String,
        required: true
      },
    email: {
        type: String,
        required: true,
        unique: true
      },
    password: {
        type: String,
        required: true
      },
    websiteLink: {
        type: String,
        required: true
      },
    hotline: {
        type: Number,
        required: true
      },
    logo: {
        type : String, // url of a photo
        required : false //was true
    },
    acceptedTermsAndConditions :{
      type : Boolean,
      default : false
    },
    IdDocument: {
        type : String, // url of a photo
        required : false // was true
    },
    taxationRegistryCard: {
      type : String, // url of a photo
      required : false //was true
    },
    isAccepted: {
        type: String,
        required: false //was true
      },
}, { timestamps : true })

module.exports = mongoose.model('advertiser' ,advertiserSchema)