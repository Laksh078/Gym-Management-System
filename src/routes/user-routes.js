const express = require('express');
const user_Route = express();
const userController = require("../controller/userController");
const path = require("path")
const bodyParser = require('body-parser');
const session = require("express-session");
const config = require("../config/config");
const auth = require("../middleware/auth");
const multer = require("multer");
const admin_route = require('./admin-routes');

const storage = multer.diskStorage({
    destination:function (req,file,cb) {
        cb(null, path.join(__dirname, '../public/userImages'));
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null,name);
    }
});

const upload = multer({storage:storage});

const storageProduct = multer.diskStorage({
    destination:function (req,file,cb) {
        cb(null, path.join(__dirname,'../public/productImage'));
    },
    filename:function (req,file,cb) {
        const name = Date.now()+'-'+file.originalname;
        cb(null,name);
    }
})

const uploadProductImage = multer({storage:storageProduct});

//Setting session id for the user
user_Route.use(session({
    secret:process.env.sessionSecret,
    resave: true, // Do not save session if it is not modified
    saveUninitialized: true, // Do not create a session until something is stored
}));

// Setting EJS as the view engine
user_Route.set('view engine', 'ejs');

// Setting the directory for views
user_Route.set('views', path.join(__dirname, '../views/User'));

//Setting Body Parser
user_Route.use(bodyParser.json());
user_Route.use(bodyParser.urlencoded({ extended: true }));

user_Route.use(express.static('src'));

user_Route.use('/admin',admin_route)

//Setting up routes

user_Route.get('/', userController.loadIndex);

user_Route.get('/index',  userController.loadIndex);

user_Route.get('/membership', userController.loadMembership);

user_Route.get('/products', userController.loadProduct); 
user_Route.get('/api/products', userController.productJson); 

user_Route.get('/checkout', userController.loadCheckout); 
user_Route.post('/checkout', userController.checkoutUpdate); 

user_Route.post('/trial', userController.loadIndexTrial);

user_Route.get('/signup', auth.isLogout,userController.loadRegister);

user_Route.post("/signup", userController.insertUser);

user_Route.get('/verify', userController.verifyMail);

user_Route.get('/login', auth.isLogout,userController.loginLoad);

user_Route.post('/login', userController.verifyLogin);

user_Route.get('/profile', auth.isLogin,userController.loadProfile);

user_Route.get('/logout', auth.isLogin, userController.userLogout);

user_Route.get('/forget',auth.isLogout, userController.forgetLoad);

user_Route.post('/forget', userController.forgetVerify);

user_Route.get('/forget-password', auth.isLogout, userController.forgetPasswordLoad);

user_Route.post('/forget-password', userController.resetPassword);

user_Route.get('/resend-verification', auth.isLogout, userController.verificationLoad);

user_Route.post('/resend-verification', userController.sendVerificationLink);

user_Route.get('/edit', auth.isLogin, userController.editProfileLoad);
user_Route.post('/edit',upload.single('image'), userController.updateProfile);

user_Route.post('/profile', userController.updateHeightWeight);

user_Route.get('/change-password', auth.isLogin, userController.loadChangePassword);
user_Route.post('/change-password', userController.changePasswordVerify);

user_Route.get('/membership/checkout',  userController.loadMembershipCheckout);
user_Route.post('/membership/checkout',  userController.membershipCheckoutUpdate);

user_Route.get('/apply', userController.applyForSellingLoad);
user_Route.post('/apply', userController.applyForSellingSubmit);

user_Route.get('/add-product',auth.isLogin, userController.addProductLoad);
user_Route.post('/add-product',uploadProductImage.single('image'), userController.addProductSubmit);

user_Route.get('*', userController.redirect404);

module.exports = user_Route;