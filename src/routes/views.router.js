import express, { json } from 'express'
import Products from '../dao/dbManagers/products.manager.js'


const router = express.Router()
const productManagerMongoose = new Products()

router.get('/', (req, res) => {

    productManagerMongoose.getAll()
        .then(products => res.render('index', { products }))
        .catch(error => res.render('index', error))

})

router.get('/realtimeproducts', (req, res) => {

    productManagerMongoose.getAll()
        .then(products => res.render('realTimeProducts', { products }))

})

router.get('/chat', (req, res) => {

    res.render('chat', {})

})
export default router