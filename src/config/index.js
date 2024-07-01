const dotenv = require('dotenv')

dotenv.config()

exports.objetConfig = {
    port: process.env.PORT || 8080,
    mongo_url: process.env.MONGO_URL,
    cookie_parser_secret: process.env.COOKIE_PARSER_SECRET,
    session_secret: process.env.SESSION_SECRET,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD
}

exports.connectDB = () => {
    const MongoSingleton = require('../utils/MongoSingleton.js')
    MongoSingleton.getInstance()
}
