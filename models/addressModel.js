const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
    street: String,
    postalCode: Number,
    city: String,
    country: String
})

module.exports = mongoose.model('Address', addressSchema)