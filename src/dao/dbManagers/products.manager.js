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

    paginate = async (page) => {
        const resp = await productsModel.paginate({}, { limit: 2, page: page || 1 })
        return resp
    }

    getWithLimit = async (limit) => {

        limit || 10

        const productsLimit = await productsModel.aggregate([
            {
                $limit: limit
            }
        ])
        return productsLimit;
    }

    getByFilter = async (filter) => {
        if (filter) {

            const resp = await productsModel.aggregate([
                {
                    $match: { category: filter }
                }
            ])
            return resp
        } else {
            const resp = await this.getAll();
            return resp;
        }
    }

    getOrderByPrice = async (sort) => {

        if (sort === 1 || sort == -1) {

            const resp = await productsModel.aggregate([

                {
                    $sort: { price: sort }
                }

            ])
            return resp
        } else {
            const resp = await this.getAll({})
            return resp
        }
    }

    filtradoMasivo = async (page, limit, sort, queryFilter) => {

        const options = {
            page: page || 1, // Página predeterminada 1 si no se proporciona
            limit: limit || 10, // Límite predeterminado 10 si no se proporciona
            sort: { price: sort === 'asc' ? 1 : -1 } // Ordenar según "sort"
        };

        const query = queryFilter ? { category: queryFilter } : {}; // Aplicar filtro si se proporciona

        try {
            const result = await productsModel.paginate(query, options);
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };


    // filtradoMasivo = async (limit, sort, queryFilter, page) => {

    //     const pipeline = [
    //         {
    //             $limit: limit
    //         }

    //     ];

    //     // Verificar si se proporciona un valor válido en "sort"
    //     if (sort === 'asc' || sort === 'desc') {
    //         pipeline.push({
    //             $sort: { price: sort === 'asc' ? 1 : -1 }
    //         });
    //     }

    //     if (queryFilter) {
    //         pipeline.push({

    //             $match: { category: queryFilter }

    //         })

    //     }

    //     const resp = await productsModel.aggregate(pipeline);

    //     return resp;
    // }


}