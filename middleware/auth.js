const authMiddleware = (req, res, next) => {
    const user = req.session.user;
    if(!user){
        return res.redirect("/login");
    }
    return next();
}

module.exports = {authMiddleware};