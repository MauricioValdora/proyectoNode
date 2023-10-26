import express from 'express'
import CartMongoose from '../dao//dbManagers/cart.manager.js'

const router = express.Router();
const cartMongoose = new CartMongoose();

router.post('/', async (req, res) => {

    const nuevoProducto = req.body;

    try {
        const respuesta = await cartMongoose.save(nuevoProducto)
        console.log(respuesta)
        if (respuesta) {
            return res.send({ message: `productos agregados correctamente al carrito con el id: ${respuesta._id}` })
        } else {
            throw Error("Error en la base de datos")
        }

    } catch (error) {
        res.status(500).send({ message: error.message })
    }

});

router.post('/:cid/products/:pid', async (req, res) => {

    const cid = req.params.cid
    const pid = req.params.pid
    try {
        const carrito = await cartMongoose.addProductToCart(cid, pid);
        return res.send(carrito)
    } catch (error) {
        res.send('el error es ' + error.message)
    }

})

router.get('/:cid', async (req, res) => {
    const cid = req.params.cid
    try {
        const respuesta = await cartMongoose.getById(cid)
        if (!respuesta) {
            throw new Error(`No se encontro el producto: ${cid} en el carrito`)
        }
        res.status(200).send({ status: 'success', payload: respuesta })

    } catch (error) {
        res.send(error.message)
    }
})

router.delete('/:cid/products/:pid', async (req, res) => {

    const cid = req.params.cid;
    const pid = req.params.pid;

    try {
        const result = await cartMongoose.deleteProductFromCart(cid, pid)
        console.log(result)
        res.send({ status: 'success', payload: result })
    } catch (error) {
        res.send({ error: error.message })
    }
})

router.delete('/:cid', async (req, res) => {

    const cid = req.params.cid;

    try {
        const result = await cartMongoose.deleteCart(cid)
        res.send({ status: 'success', payload: result })
    } catch (error) {
        res.send({ error: error.message })
    }
})

router.put('/:cid/products/:pid', async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const { quantity } = req.body
    try {
        if (!cid || !pid || !quantity) {
            return res.send({ message: 'error faltan datos' })
        }
        const result = await cartMongoose.updateQuantity(cid, pid, quantity)
        res.send({ status: 'success', payload: result })
    } catch (error) {
        res.send({ message: error.message })
    }
})

export default router;