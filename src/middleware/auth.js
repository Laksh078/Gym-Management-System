const isLogin = async (req, res, next) => {
    
    try {
        
        if (req.session.user_id) {
            
            next();
        } else {
            res.redirect('/index')
        }

    } catch (error) {
        console.log(error.message);
    }

}

const isLogout = async (req, res, next) => {
    
    try {
        
        if (req.session.user_id) {
            res.redirect('/index')
        }else{

            next();
        }

    } catch (error) {
        console.log(error.message);
    }

}

module.exports = {
    isLogin,
    isLogout
}