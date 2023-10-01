import express from 'express'
import fs from 'fs'
import CartMongoose from '../dao//dbManagers/cart.manager.js'

const router = express.Router();
const cartMongoose = new CartMongoose();

router.post('/', (req, res) => {

    const nuevoProducto = req.body;
    console.log(nuevoProducto)

    cartMongoose.save(nuevoProducto)
        .then(respuesta => res.send(`guardaste esta lista de productos `))
        .catch(error => res.send(error))

});

router.post('/:cid/product/:pid', (req, res) => {

    //Este no lo entiendo 

    const cid = parseFloat(req.params.cid)
    const pid = parseFloat(req.params.pid)

    const productList = productManager.getProducts(path);
    const productParse = JSON.parse(productList);

    const productIndex = productParse.findIndex(p => p.id === cid);

    let modificacion = {

        pid: pid,
        quantity: 1

    }
    if (productIndex !== -1) {
        productParse[productIndex] = { ...productParse[productIndex], ...modificacion };

        try {
            fs.writeFileSync(path, JSON.stringify(productParse));
            console.log('Campo actualizado exitosamente.');
            res.send("datos actualizados").status(200)
        } catch (error) {
            console.error('Error al actualizar el campo:', error);
        }
    } else {
        console.error('PRODUCT NOT FOUND');
        res.send("producto no encontrado")
    }
})

router.get('/:cid', (req, res) => {
    const cid = req.params.cid
    cartMongoose.getById(cid)
        .then(respuesta => res.send(respuesta))
        .catch(error => res.send(error))
})

export default router;