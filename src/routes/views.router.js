import express, { json } from 'express'

const router = express.Router()
import ProductManager from '../utils/ProductManager.js'
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

export default router