const mongoose = require("mongoose");

const SellerApplicationSchema = new mongoose.Schema({
    firstname: {
        type:String,
        required:true
    },
    lastname: {
        type:String,
        required:true
    },
    phone: {
        type:Number,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    description: {
        type:String,
        required:true
    }
})

const sellerApplication = mongoose.model('Seller Application', SellerApplicationSchema);

module.exports = sellerApplication;