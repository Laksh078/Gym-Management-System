const mongoose = require("mongoose");

const trial_userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    phone: {
        type:Number,
        required:true
    },
    intrest: {
        type:String,
        required:true,
        enum: ['Month to Month', '6 Month', '1 Year','Else']
    }
})

const trial_user = mongoose.model('trial_user', trial_userSchema);

module.exports = trial_user;