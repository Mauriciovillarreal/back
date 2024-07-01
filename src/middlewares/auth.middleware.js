function auth(req, res, next) {
    if (req.user?.role === 'admin') {
        return next()
    }
    return res.status(401).send('error de autorización')
}

module.exports = { auth }