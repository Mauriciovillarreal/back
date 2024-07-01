// products.router.js
const { Router } = require('express')
const ProductController = require('../../controller/producuts.controller.js')

const router = Router()
const {
    getProducts,
    getProductsByBrand,
    getProductById,
    createProduct,
    updateProductById,
    deleteProductById
} = new ProductController()

router.get('/', getProducts)
router.get('/brand/:brands', getProductsByBrand)
router.get('/:pid', getProductById)
router.post('/', createProduct)
router.put('/:pid', updateProductById)
router.delete('/:pid', deleteProductById)

module.exports = router
