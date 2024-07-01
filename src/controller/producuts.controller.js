const { productService } = require('../service/index.js')

class ProductController {
    constructor() {
        this.productsService = productService 
    }

    getProducts  = async (req, res) => {
        try {
            const products = await productService.getProducts()
            res.send(products)
        } catch (error) {
            res.status(500).send({ status: 'error', message: error.message })
        }
    }

    getProductsByBrand = async (req, res) => {
        const { brands } = req.params
        try {
            const result = await productService.getProductsBy({ brands })
            res.send({ status: 'success', data: result })
        } catch (error) {
            res.status(500).send({ status: 'error', message: error.message })
        }
    }

    getProductById = async (req, res) => {
        const { pid } = req.params
        try {
            const result = await productService.getProductsById(pid)
            res.send({ status: 'success', data: result })
        } catch (error) {
            res.status(500).send({ status: 'error', message: error.message })
        }
    }

    createProduct = async (req, res) => {
        const productData = req.body
        try {
            const result = await productService.createProduct(productData)
            res.status(201).json({ status: 'success', data: result })
        } catch (error) {
            res.status(500).send({ status: 'error', message: error.message })
        }
    }

    updateProductById = async (req, res) => {
        const { pid } = req.params
        const { name, description, code, price, stock, category } = req.body
        const updateData = {
            name: name || undefined,
            description: description || undefined,
            code: code || undefined,
            price: price || undefined,
            stock: stock || undefined,
            category: category || undefined,
        }
        try {
            const result = await productService.updateProductById(pid, updateData)
            res.json({ status: 'success', data: result })
        } catch (error) {
            res.status(500).send({ status: 'error', message: error.message })
        }
    }

    deleteProductById = async (req, res) => {
        const { pid } = req.params
        try {
            const result = await productService.deleteProductById(pid)
            res.json({ message: "Product deleted successfully", data: result })
        } catch (error) {
            res.status(500).send({ status: 'error', message: error.message })
        }
    }
}

module.exports = ProductController
