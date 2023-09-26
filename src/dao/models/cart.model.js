import mongoose from 'mongoose'

const cartCollection = 'cart'

const cartSchema = new mongoose.Schema({
    title: String,
    description: String,
    code: String,
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    thumbnails: String,
})

export const cartModel = mongoose.model(cartCollection, cartSchema);