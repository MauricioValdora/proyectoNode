import { productsModel } from '../models/products.model.js'

export default class Products {

    constructor() {
        console.log('WORKING WITH THE PRODUCTS')
    }

    getAll = async () => {
        const products = await productsModel.find().lean()
        return products
    }

    getById = async (id) => {
        const productById = await productsModel.findById({ _id: id })
        return productById
    }

    save = async (product) => {
        const result = await productsModel.create(product);
        return result;
    }

    update = async (id, product) => {
        const result = await productsModel.updateOne({ _id: id }, product)
        return result
    }

    delete = async (id) => {
        const result = await productsModel.findByIdAndDelete({ _id: id })
        return result
    }


}