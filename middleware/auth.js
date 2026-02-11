function isAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    }
    res.redirect('/admin/login');
}

function isGuest(req, res, next) {
    if (req.session && req.session.userId) {
        return res.redirect('/admin');
    }
    next();
}

module.exports = { isAuthenticated, isGuest };
