// const fs = require(`node:fs`)
const express = require('express')
const ProductsManagerMongo = require('../dao/MONGO/productsDao.Mongo.js')
const CartsManagerMongo = require('../dao/MONGO/cartDao.Mongo.js')
const { chatsModel } = require('../dao/MONGO/models/chat.model.js')

const router = express.Router()
const productsService = new ProductsManagerMongo()
const cartsService = new CartsManagerMongo()

router.get('/', async (req, res) => {
    try {
        let user = null
        let carts = null
        if (req.isAuthenticated()) {
            user = {
                name: req.user.first_name,
                lastname: req.user.last_name,
                role: req.user.role,
                email: req.user.email,
                cart: req.user.cart
            }
        }
        const { numPage, limit, brands, category } = req.query
        const filter = {}
        if (brands) filter.brands = brands
        if (category) filter.category = category

        const { docs, page, hasPrevPage, hasNextPage, prevPage, nextPage } = await productsService.getProductsPaginate({ limit, numPage, filter })
        const brandsList = await productsService.getBrands()
        const categories = await productsService.getCategories()

        if (user) {
            const cId = req.user.cart
            carts = await cartsService.getCart(cId)
        }

        res.render('products', {
            carts,
            user,
            products: docs,
            page,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            brands: brandsList,
            categories,
            styles: 'homeStyles.css',
            stylesNav: 'navBarStyles.css',
            stylesProducts: 'productsStyles.css',
            stylesProductDetail: 'productDetailStyles.css',
            stylesChat: 'chatStyles.css',
            stylesLoginRegister: 'loginRegisterStyles.css',
            stylesCart: 'cartStyles.css',
        })

    } catch (error) {
        console.error("Error occurred while fetching data:", error)
        res.status(500).json({ error: "Internal server error" })
    }
})

router.get('/productdetail/:_id', async (req, res) => {
    try {
        let user = null
        let carts = null
        const { _id } = req.params
        if (req.isAuthenticated()) {
            user = {
                name: req.user.first_name,
                lastname: req.user.last_name,
                role: req.user.admin,
                email: req.user.email,
                cart: req.user.cart
            }
            const cId = req.user.cart
            carts = await cartsService.getCart(cId)
        }
        const product = await productsService.getProductsById(_id)
        res.render('productDetail', {
            carts,
            product,
            user,
            styles: 'homeStyles.css',
            stylesNav: 'navBarStyles.css',
            stylesProducts: 'productsStyles.css',
            stylesProductDetail: 'productDetailStyles.css',
            stylesRealTime: 'realTimeStyles.css',
            stylesChat: 'chatStyles.css',
            stylesLoginRegister: 'loginRegisterStyles.css',
            stylesCart: 'cartStyles.css'
        })
    } catch (error) {
        console.error("Error occurred while rendering product detail:", error)
        res.status(500).send("Internal server error")
    }
})

router.get('/realtimeproducts', async (req, res) => {
    try {
        let user = null
        if (req.isAuthenticated()) {
            user = {
                name: req.user.first_name,
                lastname: req.user.last_name,
                role: req.user.admin,
                email: req.user.email
            }
        }
        const products = await productsService.getProducts({})
        res.render('realTimeProducts', {
            user,
            products,
            styles: 'homeStyles.css',
            stylesNav: 'navBarStyles.css',
            stylesProducts: 'productsStyles.css',
            stylesProductDetail: 'productDetailStyles.css',
            stylesRealTime: 'realTimeStyles.css',
            stylesChat: 'chatStyles.css',
            stylesLoginRegister: 'loginRegisterStyles.css',
            stylesCart: 'cartStyles.css',
        })
    } catch (error) {
        console.error("Error occurred while fetching products:", error)
        res.status(500).send("Internal server error")
    }
})

router.get('/chat', async (req, res) => {
    try {
        let user = null
        if (req.isAuthenticated()) {
            user = {
                name: req.user.first_name,
                lastname: req.user.last_name,
                role: req.user.admin,
                email: req.user.email
            }
        }
        const messages = await chatsModel.find({})
        res.render('chat', {
            user,
            messages,
            styles: 'homeStyles.css',
            stylesNav: 'navBarStyles.css',
            stylesProducts: 'productsStyles.css',
            stylesProductDetail: 'productDetailStyles.css',
            stylesRealTime: 'realTimeStyles.css',
            stylesChat: 'chatStyles.css',
            stylesLoginRegister: 'loginRegisterStyles.css',
            stylesCart: 'cartStyles.css',
        })
    } catch (error) {
        console.error("Error occurred while fetching messages:", error)
        res.status(500).send("Internal server error")
    }
})

router.get('/cart', async (req, res) => {
    try {
        let user = null
        if (req.isAuthenticated()) {
            user = {
                name: req.user.first_name,
                lastname: req.user.last_name,
                role: req.user.admin,
                email: req.user.email,
                cart: req.user.cart
            }
        }
        const cId = req.user.cart

        const carts = await cartsService.getCart(cId)
        const products = await productsService.getProducts({})
        res.render('cart', {
            user,
            carts,
            products,
            styles: 'homeStyles.css',
            stylesCart: 'cartStyles.css',
            stylesNav: 'navBarStyles.css',
            stylesProducts: 'productsStyles.css',
            stylesProductDetail: 'productDetailStyles.css',
            stylesRealTime: 'realTimeStyles.css',
            stylesChat: 'chatStyles.css',
            stylesLoginRegister: 'loginRegisterStyles.css'
        })
    } catch (error) {
        console.error("Error occurred while fetching carts:", error)
        res.status(500).send("Internal server error: " + error.message)
    }
})

router.get('/login', async (req, res) => {
    const error = req.session.error
    delete req.session.error
    res.render('login', {
        error: error || null,
        styles: 'homeStyles.css',
        stylesNav: 'navBarStyles.css',
        stylesProducts: 'productsStyles.css',
        stylesProductDetail: 'productDetailStyles.css',
        stylesRealTime: 'realTimeStyles.css',
        stylesChat: 'chatStyles.css',
        stylesLoginRegister: 'loginRegisterStyles.css',
        stylesCart: 'cartStyles.css',
    })
})

router.get('/register', async (req, res) => {
    const error = req.session.error
    delete req.session.error
    res.render('register', {
        error: error || null,
        styles: 'homeStyles.css',
        stylesNav: 'navBarStyles.css',
        stylesProducts: 'productsStyles.css',
        stylesProductDetail: 'productDetailStyles.css',
        stylesRealTime: 'realTimeStyles.css',
        stylesChat: 'chatStyles.css',
        stylesLoginRegister: 'loginRegisterStyles.css',
        stylesCart: 'cartStyles.css',
    })
})

module.exports = router