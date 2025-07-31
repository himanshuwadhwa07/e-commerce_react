const mongoose = require("mongoose")

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    },
    price: {
        type: Number,
        required: true
    }
})

const cartSchema = new mongoose.Schema({
    user: {
        type: String, // Changed from ObjectId to String
        required: true
    },
    items: [cartItemSchema],
    total: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

const cartModel = mongoose.model("Cart", cartSchema)

module.exports = cartModel 