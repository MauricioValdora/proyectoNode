import express, { json } from 'express'
import ProductManager from '../dao/fileManager/ProductManager.js'


const router = express.Router()
const productManager = new ProductManager()

router.get('/', (req, res) => {
    const path = './productos.json';

    const products = JSON.parse(productManager.getProducts(path))

    res.render('index', { products })

})

router.get('/realtimeproducts', (req, res) => {

    const path = './productos.json';

    const products = JSON.parse(productManager.getProducts(path))


    res.render('realTimeProducts', { products })

})

router.get('/chat', (req, res) => {

    res.render('chat', {})

})
export default router