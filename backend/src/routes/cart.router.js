const express = require("express");
const cartModel = require("../models/cart.model");
const productModel = require("../models/product.model");
const router = express.Router();

// Add item to cart
router.post("/add", async (req, res) => {
    try {
        const { userId, productId, quantity = 1 } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ message: "User ID and Product ID are required" });
        }

        // Get product details
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Find existing cart for user
        let cart = await cartModel.findOne({ user: userId });

        if (!cart) {
            // Create new cart if doesn't exist
            cart = new cartModel({
                user: userId,
                items: [{
                    product: productId,
                    quantity: quantity,
                    price: product.price
                }],
                total: product.price * quantity
            });
        } else {
            // Check if product already exists in cart
            const existingItem = cart.items.find(item => item.product.toString() === productId);
            
            if (existingItem) {
                // Update quantity if product already exists
                existingItem.quantity += quantity;
                existingItem.price = product.price;
            } else {
                // Add new item to cart
                cart.items.push({
                    product: productId,
                    quantity: quantity,
                    price: product.price
                });
            }

            // Recalculate total
            cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }

        await cart.save();

        res.status(200).json({ 
            message: "Item added to cart successfully", 
            cart: cart 
        });

    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ message: "Error adding item to cart" });
    }
});

// Get cart items
router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const cart = await cartModel.findOne({ user: userId })
            .populate('items.product', 'title price image description category');

        if (!cart) {
            return res.status(200).json({ items: [], total: 0 });
        }

        res.status(200).json({ 
            items: cart.items, 
            total: cart.total 
        });

    } catch (error) {
        console.error("Error getting cart:", error);
        res.status(500).json({ message: "Error getting cart items" });
    }
});

// Update cart item quantity
router.put("/update", async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (!userId || !productId || quantity < 1) {
            return res.status(400).json({ message: "User ID, Product ID and valid quantity are required" });
        }

        const cart = await cartModel.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const item = cart.items.find(item => item.product.toString() === productId);
        if (!item) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        item.quantity = quantity;
        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        await cart.save();

        res.status(200).json({ 
            message: "Cart updated successfully", 
            cart: cart 
        });

    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ message: "Error updating cart" });
    }
});

// Remove item from cart
router.delete("/remove", async (req, res) => {
    try {
        const { userId, productId } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ message: "User ID and Product ID are required" });
        }

        const cart = await cartModel.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        await cart.save();

        res.status(200).json({ 
            message: "Item removed from cart successfully", 
            cart: cart 
        });

    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).json({ message: "Error removing item from cart" });
    }
});

// Clear cart
router.delete("/clear/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const cart = await cartModel.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = [];
        cart.total = 0;

        await cart.save();

        res.status(200).json({ 
            message: "Cart cleared successfully" 
        });

    } catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).json({ message: "Error clearing cart" });
    }
});

module.exports = router; 