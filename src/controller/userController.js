const User = require('../models/registers');
const trialUser = require('../models/trial_users');
const sellerApplication = require('../models/sellerApplication');
const productDB = require('../models/products')
const path = require("path");
const nodeMailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const randomstring = require("randomstring");
const config = require("../config/config");
const sharp = require("sharp");
const fs = require('fs')


const loadIndex = async (req, res) => {
    try {
        if (req.session.user_id) {
            const userData = await User.findById({ _id:req.session.user_id });
            res.render('index', {sessionID:req.session.user_id,userInfo:userData})
            
        } else {
            
            res.render('index', {sessionID:req.session.user_id})
        }
    } catch (error) {
        console.log(error)
    }
}

const loadMembership = async (req, res) => {
    try {
        const id = req.session.user_id;
        const userData = await User.findById(id);
        res.render('membership', {sessionID:req.session.user_id,userInfo:userData})
    } catch (error) {
        console.log(error)
    }
}

const loadProduct = async (req, res) => {
    try {
        const id = req.session.user_id;
        const userData = await User.findById(id);
        const products = await productDB.find({});
        res.render('products', {sessionID:req.session.user_id,userInfo:userData,products:products, products});
    } catch (error) {
        console.log(error)
    }
}

const productJson = async (req,res) => {
    try {
        const products = await productDB.find({});
        res.json(products);
    } catch (error) {
        console.log(error)
    }
}

const loadCheckout = async (req, res) => {
    try {
        const id = req.session.user_id
        const userdata = await User.findById(id)
        if (id) {
            
            res.render('checkout', {sessionID:req.session.user_id, userInfo:userdata});
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.log(error)
    }
}

const checkoutUpdate = async (req, res) => {
    try {
        res.render('404', {message:"This feature will be added soon, Till then keep exploring"})
    } catch (error) {
        console.log(error)
    }
}


//For Hashing password
const securePassword = async(password)=>{
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;

    } catch (error) {
        console.log(error.message)
    }
}

//For Sending Mail
const sendVerifyMail = async (name, email, user_id) => {
    
    try {
        
        const transport = nodeMailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:process.env.emailUser,
                pass:process.env.emailPassword
            }
        })
        const mailOptions = {
            from: process.env.emailUser,
            to:email,
            subject:"Verification from Gym-Management-System",
            html:'<p>Hii '+name+', please click here to <a href="https://gym-management-system-mwx0.onrender.com/verify?id='+user_id+'"> Verify </a> your mail. </p>'
        }
        transport.sendMail(mailOptions, function(error,information) {
            if (error) {
                console.log(error);
            }else{
                console.log("Email successfully sent - ", information.response);
            }
        })

    } catch (error) {
        console.log(error.message)
    }

}

//For reseting the passsword 

const sendResetPasswordMail = async (name, email, token) => {
    
    try {
        
        const transport = nodeMailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:process.env.emailUser ,
                pass:process.env.emailPassword
            }
        })
        const mailOptions = {
            from: process.env.emailUser ,
            to:email,
            subject:"Verification from Gym-Management-System for Reset Password",
            html:'<p>Hii '+name+', please click here to <a href="https://gym-management-system-mwx0.onrender.com/forget-password?token='+token+'"> Reset </a> your password. </p>'
        }
        transport.sendMail(mailOptions, function(error,information) {
            if (error) {
                console.log(error);
            }else{
                console.log("Email successfully sent - ", information.response);
            }
        })

    } catch (error) {
        console.log(error.message)
    }

}

const loadRegister = async(req,res)=>{
    try {
        
        res.render('registration')

    } catch (error) {
        console.log(error.message)
    }
}  

const insertUser = async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if (password === cpassword) {
            const registerUser = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                phone: req.body.phone,
                email: req.body.email,
                age: req.body.age,
                gender: req.body.gender,
                password: password,
                confirmpassword: cpassword,
                is_admin:0
            });

            console.log("the success part" + registerUser);
            const registeredUser = await registerUser.generateAuthToken();
            const registeredUserSave = await registerUser.save();

            if (registeredUserSave) {
                sendVerifyMail(req.body.firstname, req.body.email, registeredUserSave._id);
                res.status(201).render(path.join(__dirname, "../views/User/registration.ejs"), {message: "Your registration has been successfully completed, Please verify your mail"});

            } else {

                res.status(201).render(path.join(__dirname, "../views/User/registration.ejs"), {message: "Your registration has failed, Please try again"});
                
            }
        }
        else {
            res.send("Password don't match");
        }
    } catch (error) {
        console.log(error)
        console.log(error.message)
        res.status(400).send(error.message);
    }};

const verifyMail = async (req, res) => {
      
    try {
        
        const updateVerified = await User.updateOne({_id:req.query.id},{ $set:{ is_verified: 1}});
        console.log(updateVerified);
        res.render("email-verified")

    } catch (error) {
        console.log(error.message);
    }

}

//login users into program

const loginLoad = async (req, res) => {
    
    try {
        
        res.render('login')

    } catch (error) {
        console.log(error.message);
    }

}

const verifyLogin = async (req, res) => {
    
    try {
        
        const password = req.body.password;
        const email = req.body.email;
        
        const userData = await User.findOne({ email: email })

        if (userData) {

            const isMatch = await bcrypt.compare(password, userData.password)
            
            if (isMatch) {
                if (userData.is_verified === 0) {
                    res.render('login', {message: 'Please verify your email.'});
                } else {
                    req.session.user_id = userData._id;
                    res.redirect('/index');

                }
            }
            else {
                res.render('login',{message:"Invalid Credentials"});
                console.log('here')
            }

        } else {
            res.render('login',{message:"Invalid Credentials"});
        }
    

    

    } catch (error) {
        console.log(error.message);
    }

}

//Logging out the user

const userLogout = async (req, res) => {
 
    try {
        
        req.session.destroy();
        res.redirect('/');

    } catch (error) {
        console.log(error.message)
    }

}

//Forget password code

const forgetLoad = async (req, res) => {

    try {

        res.render('forget')

    } catch (error) {

        console.log(error.message)

    }
}

const forgetVerify =async (req, res) => {
    
    try {
        
        const email = req.body.email;
        const userData = await User.findOne({email: email});
        if (userData) {
            if (userData.is_verified === 0) {
                res.render('forget', {message:"Please Verify your Email"});
            } else {
                const randomString = randomstring.generate();
                const updatedData = await User.updateOne({email:email}, {$set:{token:randomString}});
                sendResetPasswordMail(userData.firstname, userData.email, randomString);
                res.render('forget', {message:"Please Check Your mail."});
            }
        } else {
            res.render('forget',{message:"Email is not correct"})
        }
    } catch (error) {
        console.log(error.message);
    }

}

const forgetPasswordLoad = async (req, res) => {
    try {
        
        const token = req.query.token;
        const tokenData = await User.findOne({token:token});
        if (tokenData) {
            res.render('forget-password',{user_id : tokenData._id})

        } else {
            res.render('404',{message:"Invaid Request"})
        }

    } catch (error) {
        console.log(error.message);
    }
}

const resetPassword = async (req,res) => {
    try {
        
        const password = req.body.password;
        const user_id = req.body.user_id;
        
        const hashedPassword = await securePassword(password);

        const updatedData = await User.findByIdAndUpdate({_id:user_id},{$set:{ password:hashedPassword, token:''}});

        res.redirect('login')
        
    } catch (error) {
        console.log(error.message)
    }
}

//For rensending the Verification

const verificationLoad = async (req, res) => {
    try {
        
        res.render('resend-verification');

    } catch (error) {
        console.log(error.message);
    }
}

const sendVerificationLink = async (req, res) => {
    try {
        
        const email = req.body.email;
        const userData = await User.findOne({ email:email })
        if (userData) {
            if (userData.is_verified === 0) {
                sendVerifyMail(userData.firstname, userData.email, userData._id);
                res.render('resend-verification', {message:"Mail Successfully Sent"});
            } else {
                res.render('resend-verification', {message:"Mail is already verified"});
            }
            

        } else {
            res.render('resend-verification', {message:"Please check your mail"});
        }

    } catch (error) {
        console.log(error.message);
    }
}

const loadIndexTrial = async (req, res) => {
    try {
        const trial_user_submit = new trialUser(req.body);
        await trial_user_submit.save();
        res.redirect('index');
    } catch (error) {
        console.log(error.message);
    }
}

const loadProfile = async (req, res) => {
    try {
        const userData = await User.findById({ _id:req.session.user_id });
        const bmiHistory = userData.bmiHistory.map(entry => ({
            date: new Date(entry.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }
            ), // Format the date
            bmi: entry.bmi
        }));
        console.log(bmiHistory)
        res.render('profile',{userInfo:userData, bmiHistory:bmiHistory});
    } catch (error) {
        console.log(error.message)
    }
};

//Edit & Update user profile

const editProfileLoad = async (req, res) => {
    try {
        const id = req.query.id;
        const userData = await User.findById(id);
        console.log(userData)
        if (userData) {
            res.render('edit', {userInfo:userData});
            
        } else {
            res.redirect('index');
        }
    } catch (error) {
        console.log(error.message);
    }
}

const updateProfile = async (req,res) => {
    try {
        const firstname = req.body.firstname;
        console.log(firstname);
        const lastname = req.body.lastname;
        const email = req.body.emailnew;
        const phone = req.body.phone;
        const image = req.file.filename;
        console.log(image)
        const id = req.body.user_id;
        const isExist = await User.findOne({email:email})
        if (isExist) {
            res.render('404',{message:"The Email is already taken."});
        } else {
            if (email) {
                
                if (image) {
                    const userDataUpdated = await User.findByIdAndUpdate(id,{$set:{firstname:firstname,lastname:lastname,email:email,phone:phone,image:image}});
                } else {
                    const userDataUpdated = await User.findByIdAndUpdate(id,{$set:{firstname:firstname,lastname:lastname,email:email,phone:phone}});
                }
            } else {
                if (image) {
                    const userDataUpdated = await User.findByIdAndUpdate(id,{$set:{firstname:firstname,lastname:lastname,phone:phone,image:image}});
                } else {
                    const userDataUpdated = await User.findByIdAndUpdate(id,{$set:{firstname:firstname,lastname:lastname,phone:phone}});
                    console.log('Entering in else')
                }
            }
            res.redirect('profile')
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

//Height & Weight update

const updateHeightWeight = async (req, res) => {
    try {
        
        const height = req.body.height;
        const heightM = height/100;
        const weight = req.body.weight;
        const id = req.session.user_id;
        const bmi = weight/(heightM*heightM)

        // const userData = await User.findByIdAndUpdate({_id:id},{$set:{height:height, weight:weight, bmi:bmi}});
        const user = await User.findById(id);
        if (!user) {
            res.send('User Not Found');
        }
        
        user.height = height
        user.weight = weight
        user.bmi = bmi

        user.bmiHistory.push({ bmi })

        const updatedData = await user.save();
        if (updatedData) {
            res.redirect('/profile')
        } else {
            res.send('Error')
        }

    } catch (error) {
        console.log(error.message)
    }
};

//Loading change password page

const loadChangePassword = async (req, res) => {
    try {
        const id = req.session.user_id;
        const userData = await User.findById(id);
        res.render('change-password', {userInfo:userData});
    } catch (error) {
        console.log(error.message)
    }
}

//Verifying the old and the new password

const changePasswordVerify = async (req, res) => {
    try {
        const id = req.session.user_id;
        console.log(id)
        const userData = await User.findById(id);
        console.log(userData)
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        if (userData) {
            const isMatch = await bcrypt.compare(oldPassword, userData.password);
            if (isMatch) {
                const spassword = await securePassword(newPassword);
                const updatedData = await User.findByIdAndUpdate({_id:id},{$set:{password:spassword, confirmpassword:spassword}});
                if (updatedData) {
                    req.session.destroy();
                    res.redirect('/login');
                } else {
                    res.render('change-password', {message:"Password not changed",userInfo:userData});
                }
            } else {
                res.render('change-password', {message:"Password is incorrect",userInfo:userData});
            }
            
        } else {
            res.render('change-password', {message:"Some Problem Occurred, Try again later",userInfo:userData})
        }
    } catch (error) {
        console.log(error.message);
    };
};

//Loading the membership checkout view

const loadMembershipCheckout = async (req, res) => {
    try {
        const sessionID = req.session.user_id;
        if (sessionID){
            const userData = await User.findById(sessionID);
            const membership = req.query.value;
            if (membership == 1 || membership==2 || membership==3){

                res.render('membership_checkout', {sessionID:sessionID, userInfo:userData, membership:membership});
            } else{
                res.render('404', {message:"Invalid Link"})
            }
        }else{
            res.redirect('/login');
        };
    } catch (error) {
        console.log(error);
    }
}

const membershipCheckoutUpdate = async (req,res) => {
    try {
        res.render('404', {message:"This feature will be added soon, Till then keep exploring"})
    } catch (error) {
        console.log(error)
    }

}

const redirectAdmin = async (req,res) => {
    try {
        res.redirect('/admin/')
    } catch (error) {
        console.log(error)
    }
}

//Redirecting User to error page

const redirect404 = async (req, res) => {
    try {
        
        res.render('404', {message: "Page not found "})

    } catch (error) {
        console.log(error.message);
    }
};

//Load the apply for selling page

const applyForSellingLoad = async (req,res) => {
    try {
        const sessionID = req.session.user_id;
        if (sessionID) {
            const userData = await User.findById(sessionID);
            if (userData.selling == 1) {
                res.render('404',{message:"You are already a seller"})
            } else {
                
                res.render('apply', {sessionID,userInfo:userData})
            }
            
        } else {
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error);
    }
}

//Saving data in the database of selling application

const applyForSellingSubmit = async (req,res) => {
    try {
        const sessionID = req.session.user_id;
        const userData = await User.findById(sessionID);
        if(sessionID){
            if(userData){

                const newSellerApplication = new sellerApplication({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    phone: req.body.phone,
                    email: req.body.email,
                    description: req.body.description
                })

                const updatedData = await newSellerApplication.save();
                if (updatedData) {
                    res.render('apply', {message:"Saved Successfully", userInfo:userData})
                } else {
                    res.render('apply',{message:"Couldn't save the form", userInfo:userData})
                }
            }else{
                res.render('404', {message:"An error occured"})
            }
        }else{
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error.message);
    };
}

//Load the Add product page

const addProductLoad = async (req, res) => {
    try {
        const id = req.session.user_id;
        const userData = await User.findById(id);
        res.render('add-product', {userInfo:userData});
    } catch (error) {
        console.log(error.message);
    };
}

//Save and add the products 

const addProductSubmit = async (req,res) => {
    try {
        const sessionID = req.session.user_id;
        if(sessionID){
            const userData = await User.findById(sessionID);
            const owner = userData.email;
            const productImage = req.file.filename;
            const productName = req.body.product;
            const price = req.body.price;

            const newProduct = new productDB({
                Owner:owner,
                name:productName,
                price:price,
                image:productImage
            })

            const updatedData = newProduct.save();

            if (updatedData) {
                res.render('add-product', {message:"Product Added Successfully", userInfo:userData});
            } else {
                res.render('add-product', {message:"Some error occured, Product not added", userInfo:userData});
            }
        }
    } catch (error) {
        console.log(error.message);
    };
}

module.exports = {
    loadIndex,
    loadMembership,
    loadProduct,
    loadCheckout,
    loadRegister,
    insertUser,
    verifyMail,
    loginLoad,
    verifyLogin,
    userLogout,
    forgetLoad,
    forgetVerify,
    forgetPasswordLoad,
    resetPassword,
    verificationLoad,
    sendVerificationLink,
    loadIndexTrial,
    loadProfile,
    editProfileLoad,
    updateProfile,
    updateHeightWeight,
    loadChangePassword,
    changePasswordVerify,
    loadMembershipCheckout,
    membershipCheckoutUpdate,
    checkoutUpdate,
    redirect404,
    redirectAdmin,
    applyForSellingLoad,
    applyForSellingSubmit,
    addProductLoad,
    addProductSubmit,
    productJson
}