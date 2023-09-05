import express from 'express'
import fs from 'fs'
import ProductManager from '../utils/ProductManager.js'

const router = express.Router();
const productManager = new ProductManager()

function generateId() {
    const time = new Date().getTime();
    return time;
}

router.post('/', (req, res) => {
    const nuevoProducto = req.body;
    const path = './carrito.json';

    fs.readFile(path, 'utf8', (err, data) => {
        let productos = [];

        if (!err) {
            try {
                productos = JSON.parse(data);
            } catch (error) {
                console.error('Error al analizar los datos JSON existentes:', error);
                return res.status(500).send({ msg: 'Error al analizar los datos JSON existentes' });
            }
        }

        const carrito = {
            id: generateId(),
            products: nuevoProducto
        }

        productos.push(carrito);

        fs.writeFile(path, JSON.stringify(productos), (err) => {
            if (err) {
                console.error('Error al guardar los datos:', err);
                return res.status(500).send({ msg: 'Error al guardar los datos' });
            }

            console.log('El producto que se agregó:', nuevoProducto);
            res.status(200).send({ msg: 'Éxito' });
        });
    });
});

router.post('/:cid/product/:pid', (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const { product } = req.query

})

router.get('/:cid', (req, res) => {

    const cid = parseFloat(req.params.cid);
    const path = './carrito.json';


    try {
        const cartById = productManager.getProductsById(cid, path);

        if (cartById) {
            res.send(cartById);
        } else {
            res.status(404).send(`El id ${cid} no existe en la base de datos`);
        }
    } catch (error) {
        res.status(500).send('Ocurrió un error al buscar el producto');
    }


})

export default router;