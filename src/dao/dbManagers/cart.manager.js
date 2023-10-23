import { cartModel } from '../models/cart.model.js'

export default class CartMongoose {

    save = async (cart) => {
        const result = await cartModel.create(cart);
        return result;
    }

    getAll = async () => {
        const result = await cartModel.find().lean()
        return result
    }


    getById = async (id) => {
        const result = await cartModel.findById({ _id: id }).populate('products.product')
        return result
    }

    addProductToCart = async (cid, pid) => {
        const result = await cartModel.findByIdAndUpdate(cid, { $push: { products: pid } })
        return result
    }

    deleteProductFromCart = async (cid, pid) => {

        const result = await cartModel.findOneAndUpdate(
            { _id: cid },
            { $pull: { products: pid } },
            { new: true })

        return result
    }
    deleteCart = async (cid) => {

        const result = await cartModel.findOneAndDelete({ _id: cid })
        return result
    }
    updateQuantity = async (cid, pid, quantity) => {

        const result = await cartModel.findOneAndUpdate(
            { _id: cid, "products.product": pid },
            { $set: { "products.$.quantity": quantity } },
            { new: true })

        return result
    }
}