const User = require("../models/registers")

const isLogin = async (req, res, next) => {
    try {
        
        if (req.session.user_id) {

            next();
        } else {
            res.redirect("/admin")
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

const isLogout = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            res.redirect('/admin/home');
        }else{
            next();
        }
    } catch (error) {
        console.log(error.message)
    }
}

const isAdmin = async (req, res, next) => {
    try {
        const id = req.session.user_id;
        const userData = await User.findById(id);
        if (id) {
            if (userData.is_admin == 1) {
                next();
            } else {
                res.render('404',{message:"Access Denied, You are not a admin"});
            }
        } else{
            res.redirect('/admin/');
        };
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    isLogin,
    isLogout,
    isAdmin
}