const User = require('../models/registers');
const trialUser = require('../models/trial_users');
const sellerApplication = require('../models/sellerApplication');
const productDB = require('../models/products')
const bcrypt = require("bcryptjs")
const randomstring = require('randomstring')
const config = require('../config/config')
const nodeMailer = require('nodemailer');
const mongoose = require('mongoose')

//For converting password to hash

const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;

    } catch (error) {
        console.log(error.message)
    }
}

//For verifying user's email andd sending a verification link to it

const addUserMail = async (name, email, password, user_id) => {

    try {

        const transport = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.emailUser,
                pass: process.env.emailPassword
            }
        })
        const mailOptions = {
            from: process.env.emailUser,
            to: email,
            subject: "Verification from Gym-Management-System",
            html: '<p>Hii ' + name + ', please click here to <a href="https://gym-management-system-mwx0.onrender.com/verify?id=' + user_id + '"> Verify </a> your mail. </p> <br> <b>Email:-</b>' + email + '<br> <b>Password:-</b>' + password + ''
        }
        transport.sendMail(mailOptions, function (error, information) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email successfully sent - ", information.response);
            }
        })

    } catch (error) {
        console.log(error.message)
    }

}

//For sending the password reset mail

const sendAdminResetPasswordMail = async (name, email, token) => {

    try {

        const transport = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.emailUser,
                pass: process.env.emailPassword
            }
        })
        const mailOptions = {
            from: process.env.emailUser,
            to: email,
            subject: "Verification from Gym-Management-System for Reset Password",
            html: '<p>Hii ' + name + ', please click here to <a href="https://gym-management-system-mwx0.onrender.com/admin/forget-password?token=' + token + '"> Reset </a> your password. </p>'
        }
        transport.sendMail(mailOptions, function (error, information) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email successfully sent - ", information.response);
            }
        })

    } catch (error) {
        console.log(error.message)
    }

}

//Loading the login page 

const loadLogin = async (req, res, next) => {
    try {
        res.render('login')

    } catch (error) {
        console.log(error.message);
    }
};

//For redirecting the user to 404 page if it encounters some error

const redirect404 = async (req, res) => {
    try {

        res.render('404', { message: "Page not found " })

    } catch (error) {
        console.log(error.message);
    }
};

//For logging in the admin

const verifyLogin = async (req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ email: email })
        if (userData) {

            const passwordMatch = await bcrypt.compare(password, userData.password);

            if (passwordMatch) {

                if (userData.is_admin === 0) {

                    res.render('login', { message: "Credential are invalid" });

                } else {
                    req.session.user_id = userData._id;
                    res.redirect('/admin/home')
                }

            } else {
                res.render('login', { message: "Credential are invalid" })
            }

        } else {
            res.render('login', { message: "Credential are invalid" })
        }

    } catch (error) {
        console.log(error.message)
    }
};

//Loading the dashboard for admin

const loadDashboard = async (req, res) => {
    try {
        const id = req.session.user_id;
        const userData = await User.findById(id);
        res.render('home', { admin: userData });
    } catch (error) {
        console.log(error.message)
    }
}

//Logging out the admin

const logout = async (req, res) => {
    try {
        console.log("eroooor")
        req.session.destroy((error) => {
            if (error) {
                console.log(error);
                res.status(500).send("error")
            }
        });
        res.redirect('/admin');
    } catch (error) {
        console.log(error.message)
    }
}

//For forget password view

const forgetLoad = async (req, res) => {
    try {
        res.render('forget');
    } catch (error) {
        console.log(error.message);
    }
}

//For verifying if admin has entered the right email or not

const forgetVerify = async (req, res) => {
    try {

        const email = req.body.email;
        const userData = await User.findOne({ email })

        if (userData) {
            if (userData.is_admin === 0) {
                res.render('forget', { message: 'Email is not correct' });
            } else {
                const randomString = randomstring.generate();
                const updatedData = await User.updateOne({ email }, { $set: { token: randomString } });
                sendAdminResetPasswordMail(userData.firstname, userData.email, randomString);
                res.render('forget', { message: 'Please Check your Email' });
            }
        } else {
            res.render('forget', { message: 'Email is not correct' });
        }

    } catch (error) {
        console.log(error.message);
    }
}

//For loading the forget password page

const forgetPasswordLoad = async (req, res) => {
    try {

        const token = req.query.token;
        const tokenData = await User.findOne({ token })

        if (tokenData) {
            res.render('forget-password', { user_id: tokenData._id })
        } else {
            res.render('404', { message: 'Invalid Request' });
        }

    } catch (error) {
        console.log(error.message)
    }
}

//For updating the password and emptying the token field

const resetPassword = async (req, res) => {
    try {

        const password = req.body.password;
        const user_id = req.body.user_id;

        const securePass = await securePassword(password);
        const updatedData = await User.findByIdAndUpdate({ _id: user_id }, { $set: { password: securePass, confirmpassword: securePass, token: "" } });

        res.redirect('/admin')


    } catch (error) {
        console.log(error.message)
    }
}

//Loading of the admin profile

const loadProfile = async (req, res) => {
    try {
        const id = req.session.user_id;
        const userData = await User.findOne({ _id: id });
        const count = await User.countDocuments({});
        const countAdmin0 = await User.countDocuments({ is_admin: 0 });
        const countAdmin = await User.countDocuments({ is_admin: 1 });
        const countVerified0 = await User.countDocuments({ is_verified: 0 });
        const countVerified = await User.countDocuments({ is_verified: 1 });
        const countTrial = await trialUser.countDocuments({});
        const countSellerApplication = await sellerApplication.countDocuments({});
        res.render('profile', {
            admin: userData,
            count: count,
            countAdmin0: countAdmin0,
            countVerified0: countVerified0,
            countVerified: countVerified,
            countTrial: countTrial,
            countAdmin: countAdmin,
            countSellerApplication: countSellerApplication
        });
    } catch (error) {
        console.log(error.message);
    }
}

//Loading the admin dashboard and handling the tasks done by the admin

const adminDashboard = async (req, res) => {
    try {
        const id = req.session.user_id;
        const userData = await User.findOne({ _id: id });
        const message = req.query.message;
        const messageSuccess = req.query.messageSuccess;
        const messageAddSuccess = req.query.messageAddSuccess;
        const messageUpdateSuccess = req.query.messageUpdateSuccess;

        var search = '';
        if (req.query.search) {
            search = req.query.search
        }
        var page = '1';
        if (req.query.page) {
            page = req.query.page
        }

        const limit = 10;


        const usersData = await User.find({
            is_admin: 0,
            $or: [
                { firstname: { $regex: '.*' + search + '.*', $options: 'i' } },
                { lastname: { $regex: '.*' + search + '.*', $options: 'i' } },
                { email: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await User.find({
            is_admin: 0,
            $or: [
                { firstname: { $regex: '.*' + search + '.*', $options: 'i' } },
                { lastname: { $regex: '.*' + search + '.*', $options: 'i' } },
                { email: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        })
            .countDocuments();

        res.render('dashboard', {
            admin: userData,
            users: usersData,
            message: message,
            messageSuccess: messageSuccess,
            messageAddSuccess: messageAddSuccess,
            messageUpdateSuccess: messageUpdateSuccess,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            previousPage: page - 1,
            nextPage: Number(page) + 1,
            search: search
        });
    } catch (error) {
        console.log(error.message);
    };
};

//Loading the page where admin will add the user

const newUserLoad = async (req, res) => {
    try {

        const id = req.session.user_id;
        const userData = await User.findOne({ _id: id });
        res.render('new-user', { admin: userData });

    } catch (error) {
        console.log(error.message);
    };
}

//Create New User Via Admin Panel

const addUser = async (req, res) => {
    try {

        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const email = req.body.email;
        const phone = req.body.phone;
        const age = req.body.age;
        const gender = req.body.gender;
        const password = randomstring.generate(8);
        const spassword = await securePassword(password);

        const user = new User({
            firstname: firstname,
            lastname: lastname,
            email: email,
            phone: phone,
            age: age,
            gender: gender,
            password: spassword,
            confirmpassword: spassword

        });

        const userData = await user.save();

        if (userData) {
            addUserMail(userData.firstname, userData.email, password, userData._id);
            res.redirect('/admin/dashboard?messageAddSuccess=User+Added+Successfully');
        } else {
            res.render('new-user', { message: "Please Try Again Later" });
        };

    } catch (error) {
        console.log(error.message)
    };
};

//Edit User by Admin

const editUserLoad = async (req, res) => {
    try {
        const id = req.session.user_id;
        const userData = await User.findOne({ _id: id });

        const userId = req.query.id;
        const userDataEdit = await User.findById({ _id: userId });
        if (userDataEdit) {

            res.render('edit-user', { admin: userData, user: userDataEdit });
        } else {
            res.redirect('/admin/dashboard');
        }
    } catch (error) {
        console.log(error.message);
    };
};

//Updating the profile of user by admin

const updateUserAdmin = async (req, res) => {
    try {
        const id = req.body.id;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const email = req.body.email;
        const phone = req.body.phone;
        const verify = req.body.verify;

        const adminId = req.session.user_id;
        const admin = await User.findOne({ _id: adminId });

        if (email) {
            const isDuplicate = await User.findOne({ email: email });
            if (isDuplicate) {
                res.redirect('/admin/dashboard?message=Email+Already+Exists');
            } else {

                const userDataEmail = await User.findByIdAndUpdate({ _id: id }, { $set: { firstname: firstname, lastname: lastname, email: email, phone: phone, is_verified: verify } });
                res.redirect('/admin/dashboard?messageUpdateSuccess=User+Updated+Successfully');
            }
        } else {
            const userData = await User.findByIdAndUpdate({ _id: id }, { $set: { firstname: firstname, lastname: lastname, phone: phone, is_verified: verify } });
            res.redirect('/admin/dashboard?messageUpdateSuccess=User+Updated+Successfully');
        }


    } catch (error) {
        console.log(error.message);
    }
}

//Delete User By Admin

const deleteUserAdmin = async (req, res) => {
    try {
        const id = req.query.id;
        await User.deleteOne({ _id: id });
        res.redirect('/admin/dashboard?messageSuccess=User+Deleted+Successfully')
    } catch (error) {
        console.log(error.message)
    }
};

//Loading edit profile

const editProfileLoad = async (req, res) => {
    try {
        const id = req.query.id;
        const userData = await User.findById(id);
        console.log(userData)
        if (userData) {
            res.render('edit', { admin: userData });

        } else {
            res.redirect('index');
        };
    } catch (error) {
        console.log(error.message);
    };
};

const updateProfile = async (req, res) => {
    try {
        const firstname = req.body.firstname;
        console.log(firstname);
        const lastname = req.body.lastname;
        const email = req.body.emailnew;
        const phone = req.body.phone;
        const image = req.file.filename;
        console.log(image)
        const id = req.body.user_id;
        const isExist = await User.findOne({ email: email })
        if (isExist) {
            res.render('404', { message: "The Email is already taken." });
        } else {
            if (email) {

                if (image) {
                    const userDataUpdated = await User.findByIdAndUpdate(id, { $set: { firstname: firstname, lastname: lastname, email: email, phone: phone, image: image } });
                } else {
                    const userDataUpdated = await User.findByIdAndUpdate(id, { $set: { firstname: firstname, lastname: lastname, email: email, phone: phone } });
                }
            } else {
                if (image) {
                    const userDataUpdated = await User.findByIdAndUpdate(id, { $set: { firstname: firstname, lastname: lastname, phone: phone, image: image } });
                } else {
                    const userDataUpdated = await User.findByIdAndUpdate(id, { $set: { firstname: firstname, lastname: lastname, phone: phone } });
                    console.log('Entering in else')
                }
            }
            res.redirect('profile')
        }

    } catch (error) {
        console.log(error.message);
    }
}

//Loading change password page

const loadChangePassword = async (req, res) => {
    try {
        const id = req.session.user_id;
        const userData = await User.findById(id);
        res.render('change-password', { admin: userData });
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
                const updatedData = await User.findByIdAndUpdate({ _id: id }, { $set: { password: spassword, confirmpassword: spassword } });
                if (updatedData) {
                    req.session.destroy();
                    res.redirect('/admin');
                } else {
                    res.render('change-password', { message: "Password not changed" });
                }
            } else {
                res.render('change-password', { message: "Password is incorrect" });
            }

        } else {
            res.render('change-password', { message: "Some Problem Occurred, Try again later" })
        }
    } catch (error) {
        console.log(error.message);
    };
}

//Load the seller application

const sellerApplicationLoad = async (req, res) => {
    try {
        const sessionID = req.session.user_id;
        const userData = await User.findById(sessionID);

        const message = req.query.message;
        const messageSuccess = req.query.messageSuccess;
        const messageAddSuccess = req.query.messageAddSuccess;
        const messageUpdateSuccess = req.query.messageUpdateSuccess;

        var search = '';
        if (req.query.search) {
            search = req.query.search
        }
        var page = '1';
        if (req.query.page) {
            page = req.query.page
        }

        const limit = 10;


        const usersData = await sellerApplication.find({
            $or: [
                { firstname: { $regex: '.*' + search + '.*', $options: 'i' } },
                { lastname: { $regex: '.*' + search + '.*', $options: 'i' } },
                { email: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await sellerApplication.find({
            $or: [
                { firstname: { $regex: '.*' + search + '.*', $options: 'i' } },
                { lastname: { $regex: '.*' + search + '.*', $options: 'i' } },
                { email: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        })
            .countDocuments();

        res.render('seller-application', {
            admin: userData,
            users: usersData,
            message: message,
            messageSuccess: messageSuccess,
            messageAddSuccess: messageAddSuccess,
            messageUpdateSuccess: messageUpdateSuccess,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            previousPage: page - 1,
            nextPage: Number(page) + 1,
            search: search
        });
    } catch (error) {
        console.log(error.message)
    }
}

//Approve the seller

const approveSellerApplication = async (req, res) => {
    try {
        const id = req.query.id;
        const sellerData = await sellerApplication.findById(id)
        if (sellerData) {
            const sellerEmail = sellerData.email;
            const updatedData = await User.findOneAndUpdate({ email: sellerEmail }, { $set: { selling: 1 } })
            await sellerApplication.deleteOne({ _id: id })
            if (updatedData) {
                res.redirect('/admin/selling-application')
            } else {
                res.redirect('/admin/selling-application')
            }
        } else {
            res.redirect('/admin/selling-application')
        }
    } catch (error) {
        console.log(error.message)
    }
}

//Deny the seller application

const denySellerApplication = async (req, res) => {
    try {
        const id = req.query.id;
        await sellerApplication.deleteOne({ _id: id });
        res.redirect('/admin/selling-application?message=Application+Denied')
    } catch (error) {
        console.log(error.message)
    }
}

//For loading the product manger page

const productManager = async (req, res) => {
    try {
        const sessionID = req.session.user_id;
        const userData = await User.findById(sessionID);

        const message = req.query.message;
        const messageSuccess = req.query.messageSuccess;
        const messageAddSuccess = req.query.messageAddSuccess;
        const messageUpdateSuccess = req.query.messageUpdateSuccess;

        var search = '';
        if (req.query.search) {
            search = req.query.search
        }
        var page = '1';
        if (req.query.page) {
            page = req.query.page
        }

        const limit = 10;


        const usersData = await productDB.find({
            $or: [
                { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                { owner: { $regex: '.*' + search + '.*', $options: 'i' } },
                { email: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await productDB.find({
            $or: [
                { firstname: { $regex: '.*' + search + '.*', $options: 'i' } },
                { lastname: { $regex: '.*' + search + '.*', $options: 'i' } },
                { email: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        })
            .countDocuments();

        res.render('product-manager', {
            admin: userData,
            product: usersData,
            message: message,
            messageSuccess: messageSuccess,
            messageAddSuccess: messageAddSuccess,
            messageUpdateSuccess: messageUpdateSuccess,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            previousPage: page - 1,
            nextPage: Number(page) + 1,
            search: search
        });
    } catch (error) {
        console.log(error.message)
    }

}

//For deleting the product by admin

const deleteProductAdmin =  async (req,res) => {
    try {
        const productID = req.query.id;
        const updatedData = await productDB.deleteOne({_id:productID});
        if (updatedData) {
            res.redirect('/admin/product-manager?message=Product+Deleted')
        } else {
            res.redirect('/admin/404?message=Unable+To+Delete+Product')
        }
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    loadLogin,
    redirect404,
    verifyLogin,
    loadDashboard,
    logout,
    forgetLoad,
    forgetVerify,
    forgetPasswordLoad,
    resetPassword,
    loadProfile,
    adminDashboard,
    newUserLoad,
    addUser,
    editUserLoad,
    updateUserAdmin,
    deleteUserAdmin,
    editProfileLoad,
    updateProfile,
    loadChangePassword,
    changePasswordVerify,
    sellerApplicationLoad,
    approveSellerApplication,
    denySellerApplication,
    productManager,
    deleteProductAdmin
};