const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
    Owner: {
        type:String,
        required:true
    },
    name: {
        type:String,
        required:true
    },
    price: {
        type:Number,
        required:true
    },
    image: {
        type:String,
        required:true
    }
})

const products = mongoose.model('Products', productsSchema);

module.exports = products;