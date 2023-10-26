import express from 'express'
import Products from '../dao/dbManagers/products.manager.js'
import MessageManager from '../dao/dbManagers/messages.manager.js'
import CartMongoose from '../dao/dbManagers/cart.manager.js'


const router = express.Router()
const productManagerMongoose = new Products()
const chatManager = new MessageManager()
const cartModel = new CartMongoose()


//medlewares

const publicAcces = (req, res, next) => {
    if (req.session.user) return res.redirect('/')
    next()
}
const privateAcces = (req, res, next) => {
    if (!req.session.user) return res.redirect('/login')
    next()
}

router.get('/products', privateAcces,async (req, res) => {

    const { limit, page, sort, queryFilter } = req.query

    const limite = limit ? parseInt(limit) : 10
    const { docs, hasNextPage, hasPrevPage, nextPage, prevPage } = await productManagerMongoose.filtradoMasivo(page, limite, sort, queryFilter)
    console.log(docs)
    res.render('index', {
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage,
        user: req.session.user,
        docs
    })
})

router.get('/realtimeproducts', privateAcces,(req, res) => {

    productManagerMongoose.getAll()
        .then(products => {
            res.render('realTimeProducts', { products })
        })
})

router.get('/chat', (req, res) => {

    chatManager.getAll()
        .then(chats => res.render('chat', { chats }))
        .catch(error => res.render(error))

})

router.get('/carts/:cid',privateAcces, async (req, res) => {
    const cid = req.params.cid;
    const cart = await cartModel.getById(cid);
    const jsonCart = cart.products[0].product;
    const cantidad = cart.products[0].quantity;
    jsonCart.cantidad = cantidad
    res.render('cart', jsonCart);
})

router.get('/register', publicAcces, (req, res) => {
    res.render('register')
})
router.get('/login', publicAcces, (req, res) => {
    res.render('login')
})
router.get('/', privateAcces, (req, res) => {
    console.log(req.session.user)
    res.render('profile', {
        user: req.session.user
    })
})

export default router