import { cartModel } from '../models/cart.model.js'
import { productsModel } from '../models/products.model.js'

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
        const cart = await cartModel.findOne({ _id: cid })
        const product = await productsModel.findOne({ _id: pid })
        if (!cart) {
            throw new Error('El carrito no existe')
        }
        if (!product) {
            throw new Error('El Producto no existe')
        }

        const existingProductIndex = cart.products.findIndex(product => product._id == pid)

        if (existingProductIndex == -1) {
            cart.products.push({
                _id: pid,
                quantity: 1
            })
        } else {
            cart.products[existingProductIndex].quantity = cart.products[existingProductIndex].quantity + 1
        }
        cart.save()

        return cart
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