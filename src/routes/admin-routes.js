const express = require("express");
const admin_route = express();
const path = require('path')
const multer = require('multer')

const session  = require('express-session');
const config = require('../config/config');

admin_route.use(session({
    secret:process.env.sessionSecret,
    resave: true, // Do not save session if it is not modified
    saveUninitialized: true, // Do not create a session until something is stored
}));

//Setting up multer

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

//Setting up the body parser

const bodyParser = require("body-parser");
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));

//Setting up the view engine

admin_route.set('view engine', 'ejs');
admin_route.set('views', path.join(__dirname, '../views/admin'));

//Requiring additional files like middleware and controller

const auth = require('../middleware/adminAuth');
const adminController = require('../controller/adminController');

//Defining the routes

admin_route.get('/',auth.isLogout,adminController.loadLogin);
admin_route.post('/', adminController.verifyLogin);

admin_route.get('/home', auth.isLogin ,auth.isAdmin,adminController.loadDashboard);

admin_route.get('/logout',auth.isLogin ,auth.isAdmin,adminController.logout);

admin_route.get('/forget', auth.isLogout,auth.isAdmin, adminController.forgetLoad);
admin_route.post('/forget', auth.isLogout,auth.isAdmin, adminController.forgetVerify);

admin_route.get('/forget-password', auth.isLogout,auth.isAdmin, adminController.forgetPasswordLoad);
admin_route.post('/forget-password', adminController.resetPassword);

admin_route.get('/profile', auth.isLogin,auth.isAdmin, adminController.loadProfile);

admin_route.get('/dashboard', auth.isLogin,auth.isAdmin, adminController.adminDashboard);

admin_route.get('/new-user', auth.isLogin,auth.isAdmin, adminController.newUserLoad);
admin_route.post('/new-user', adminController.addUser);

admin_route.get('/edit-users', auth.isLogin,auth.isAdmin ,adminController.editUserLoad);
admin_route.post('/edit-users', adminController.updateUserAdmin);

admin_route.get('/delete-users', auth.isLogin,auth.isAdmin, adminController.deleteUserAdmin);

admin_route.get('/edit', auth.isLogin,auth.isAdmin, adminController.editProfileLoad);

admin_route.post('/edit', upload.single('image'), adminController.updateProfile);

admin_route.get('/change-password', auth.isLogin,auth.isAdmin, adminController.loadChangePassword);
admin_route.post('/change-password', adminController.changePasswordVerify);

admin_route.get('/selling-application', auth.isAdmin, adminController.sellerApplicationLoad)

admin_route.get('/approve-seller',auth.isLogin, auth.isAdmin, adminController.approveSellerApplication)

admin_route.get('/deny-seller',auth.isLogin, auth.isAdmin, adminController.denySellerApplication)

admin_route.get('/product-manager',auth.isLogin, auth.isAdmin, adminController.productManager)

admin_route.get('/delete-product',auth.isLogin, auth.isAdmin, adminController.deleteProductAdmin)
            
admin_route.get('*', adminController.redirect404);

module.exports = admin_route;