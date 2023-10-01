import express, { json } from 'express'
import Products from '../dao/dbManagers/products.manager.js'
import MessageManager from '../dao/dbManagers/messages.manager.js'


const router = express.Router()
const productManagerMongoose = new Products()
const chatManager = new MessageManager()

router.get('/products', async (req, res) => {

    const { limit, page, sort, queryFilter } = req.query

    const limite = limit ? parseInt(limit) : 10
    const { docs, hasNextPage, hasPrevPage, nextPage, prevPage } = await productManagerMongoose.filtradoMasivo(page, limite, sort, queryFilter)

    const products = docs;
    res.render('index', {
        products,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage
    })
    // productManagerMongoose.getAll()
    //     .then(products => res.render('index', { products }))
    //     .catch(error => res.render('index', error))

})

router.get('/realtimeproducts', (req, res) => {

    productManagerMongoose.getAll()
        .then(products => res.render('realTimeProducts', { products }))

})

router.get('/chat', (req, res) => {

    chatManager.getAll()
        .then(chats => res.render('chat', { chats }))
        .catch(error => res.render(error))

})
export default router