import { cartModel } from '../models/cart.model.js'

export default class CartMongoose {

    save = async (cart) => {
        const result = await cartModel.create();
        result.push(cart)
        return result;
    }

    getAll = async () => {
        const result = await cartModel.find().lean()
        return result
    }


    getById = async (id) => {
        const result = await cartModel.findById({ _id: id })
        return result
    }
}