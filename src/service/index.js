const ProductsManagerMongo = require('../dao/MONGO/productsDao.Mongo.js')
const CartsManagerMongo = require('../dao/MONGO/cartDao.Mongo.js')
const { usersModel } = require('../models/users.model.js')

const productService = new ProductsManagerMongo()
const cartService = new CartsManagerMongo()

module.exports = {
    productService,
    cartService,
    usersModel
}
