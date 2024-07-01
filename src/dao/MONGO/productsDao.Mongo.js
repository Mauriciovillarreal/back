const { productsModel } = require('../../models/products.model.js')

class ProductsDaoMongo {
    constructor() {
        this.model = productsModel
    }

    getProductsPaginate = async ({ limit = 16, numPage = 1, filter = {} }) => {
        try {
            const products = await this.model.paginate(filter, { limit, page: numPage, lean: true })
            return products
        } catch (error) {
            console.error("Error occurred while getting products:", error)
            throw new Error("Internal server error")    
        }
    }
    
    async getProducts() {
        return await this.model.find()
    }

    getProductsBy = async (filter) => {
        try {
            return await this.model.find(filter)
        } catch (error) {
            console.error("Error occurred while getting products by filter:", error)
            throw new Error("Internal server error")
        }
    }

    getProductsById = async (_id) => {
        try {
            const product = await this.model.findById(_id)
            if (!product) {
                throw new Error('Product not found')
            }
            return product
        } catch (error) {
            console.error("Error occurred while getting product:", error)
            throw new Error("Internal server error")
        }
    }
    

    createProduct = async (productData) => {
        try {
            const newProduct = await this.model.create(productData)
            return newProduct
        } catch (error) {
            console.error("Error occurred while creating product:", error)
            throw new Error("Internal server error")
        }
    }

    updateProductById = async (pid, updateData) => {
        try {
            const updatedProduct = await this.model.findByIdAndUpdate(pid, updateData, { new: true })
            if (!updatedProduct) {
                throw new Error('Product not found')
            }
            return updatedProduct
        } catch (error) {
            console.error("Error occurred while updating product:", error)
            throw new Error("Internal server error")
        }
    }

    deleteProductById = async (pid) => {
        try {
            const deletedProduct = await this.model.findByIdAndDelete(pid)
            if (!deletedProduct) {
                throw new Error('Product not found')
            }
            return deletedProduct
        } catch (error) {
            console.error("Error occurred while deleting product:", error)
            throw new Error("Internal server error")
        }
    }

    getBrands = async () => {
        try {
            return await this.model.distinct('brands')
        } catch (error) {
            console.error("Error occurred while getting brands:", error)
            throw new Error("Internal server error")
        }
    }

    getCategories = async () => {
        try {
            return await this.model.distinct('category')
        } catch (error) {
            console.error("Error occurred while getting categories:", error)
            throw new Error("Internal server error")
        }
    }
}

module.exports = ProductsDaoMongo
