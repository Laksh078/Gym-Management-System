const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userID:{
        type:String,
        required:true
    },
    products:[
        {
            productID: mongoose.Schema.Types.ObjectId,
            quantity:{
                type:Number,
                required:true
            }
        }
    ]
    
});

const cart = mongoose.model('Cart', cartSchema);

module.exports = cart;