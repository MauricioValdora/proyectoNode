import express from 'express'
import Products from '../dao/dbManagers/products.manager.js'
import MessageManager from '../dao/dbManagers/messages.manager.js'
import CartMongoose from '../dao/dbManagers/cart.manager.js'


const router = express.Router()
const productManagerMongoose = new Products()
const chatManager = new MessageManager()
const cartModel = new CartMongoose()

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

router.get('/carts/:cid', async (req, res) => {
    const cid = req.params.cid;
    const cart = await cartModel.getById(cid);
    const jsonCart = cart.products[0].product;
    const cantidad = cart.products[0].quantity;
    jsonCart.cantidad = cantidad
    res.render('cart', jsonCart);
})
export default router