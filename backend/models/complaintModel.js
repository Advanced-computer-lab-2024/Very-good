const mongoose = require('mongoose')

const schema = mongoose.Schema

const complaintSchema = new schema({

    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    touristId: {
        type: schema.Types.ObjectId,
        ref: 'tourist' 
    },
    isResolved: {
        type: Boolean,
        default: false
    }

}, { timestamps : true })

module.exports = mongoose.model('tourist' ,complaintSchema)