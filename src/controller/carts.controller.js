const { cartService } = require('../service/index.js')
const mongoose = require('mongoose');

class CartController {
    constructor() {
        this.cartsService = cartService
    }

    getCarts = async (req, res) => {
        try {
            const carts = await cartService.getCarts()
            res.send(carts)
        } catch (error) {
            console.error('An error occurred while retrieving the carts:', error)
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    getCartById = async (req, res) => {
        try {
            const { cid } = req.params;
            if (!mongoose.Types.ObjectId.isValid(cid)) {
                return res.status(400).json({ error: 'Invalid cart ID' });
            }
            const cart = await cartService.getCart(cid);
            if (!cart) {
                return res.status(404).json({ error: 'Cart not found' });
            }
            res.json(cart);
        } catch (error) {
            console.error('An error occurred while retrieving the cart:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    createCart = async (req, res) => {
        try {
            const cart = await cartService.createCart()
            res.send(cart)
        } catch (error) {
            console.error('An error occurred while creating the cart:', error)
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    addProductToCart = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            console.log('Received cid:', cid, 'pid:', pid); // Debugging log
            if (!cid || !pid) {
                return res.status(400).json({ error: 'Missing cart ID or product ID' });
            }
            const cart = await cartService.addProductToCart(cid, pid);
            res.json(cart);
        } catch (error) {
            console.error('An error occurred while adding the product to the cart:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
    

    deleteCart = async (req, res) => {
        try {
            const { cid } = req.params
            const result = await cartService.deleteCart(cid)
            res.json({ message: "Cart deleted successfully", data: result })
        } catch (error) {
            console.error('An error occurred while deleting the cart:', error)
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    deleteProduct = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            console.log('Received cid:', cid, 'pid:', pid); // Debugging log
            if (!cid || !pid) {
                return res.status(400).json({ error: 'Missing cart ID or product ID' });
            }
            const cart = await cartService.deleteProduct(cid, pid);
            res.json({ message: "Product deleted successfully", data: cart });
        } catch (error) {
            console.error('An error occurred while deleting the product from the cart:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
    

    updateProductQuantity = async (req, res) => {
        try {
            const { cid, pid } = req.params
            const { quantity } = req.body
            const updatedCart = await cartService.updateProductQuantity(cid, pid, quantity)
            res.json({ message: "Quantity was changed successfully", data: updatedCart })
        } catch (error) {
            console.error('An error occurred while updating the product quantity:', error)
            res.status(500).json({ error: 'Internal server error' })
        }
    }
}

module.exports = CartController
