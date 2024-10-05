const mongoose = require('mongoose');

const schema = mongoose.Schema;

const adminSchema = new schema({
    username: {
        type: String,
        required: true,
        unique: true // Ensure username is unique
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensure email is unique
    }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
