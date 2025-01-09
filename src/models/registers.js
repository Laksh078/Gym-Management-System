const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    firstname: {
        type : String,
        required : true
    },
    lastname:{
        type : String,
        required : true
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    age:{
        type:String,
        required:true,
    },
    gender:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    },
    is_admin:{
        type:Number,
        required:true,
        default:0
    },
    is_verified:{
        type:Number,
        default:0
    },
    selling:{
        type:Number,
        default:0
    },
    image:{
        type:String,
        default:'images.jpg'
    },
    token:{
        type:String,
        default:''
    },
    height:{
        type:Number,
        default:""
    },
    weight:{
        type:Number,
        default:""
    },
    bmi:{
        type:Number,
        default:""
    },
    bmiHistory: [{
        bmi:{
            type: Number,
            default:""
        },
        date:{
            type: Date,
            default: Date.now
        }
    }]
})

// generating tokens

userSchema.methods.generateAuthToken = async function() {
    try {
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch (error) {
        // res.status(500).send("The error part"+ error);
        console.log("The error part"+ error);
    }
}

// res.status(201).json({msg: userSchema, token: await userSchema});


// converting password into hash
userSchema.pre("save" , async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmpassword = await bcrypt.hash(this.password, 10);
    }
    next();
})


const Register = new mongoose.model("Account" , userSchema);

module.exports = Register;