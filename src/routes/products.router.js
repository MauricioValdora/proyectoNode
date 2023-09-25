import express from 'express'
import { socketServer } from '../app.js'
import Products from '../dao/dbManagers/products.manager.js'
const router = express.Router();

const productManagerMongoose = new Products()

router.use(express.json());

router.use(express.urlencoded({ extended: true }));


// traer todos los datos
router.get('/', (req, res) => {

    const { limit } = req.query
    productManagerMongoose.getAll()
        .then(product => res.send(product))
        .catch(error => res.status(500).send(error))
})

// Traer datos por id
router.get('/:pid', (req, res) => {

    const pId = req.params.pid;
    console.log(pId)

    productManagerMongoose.getById(pId)
        .then(product => res.send(product))
        .catch(error => res.status(500).send(error))

});


// Retorno los productos existentes si es que los hay
router.post('/', (req, res) => {
    const product = req.body;

    if (
        typeof product.title !== 'string' ||
        typeof product.description !== 'string' ||
        typeof product.code !== 'string' ||
        typeof product.price !== 'number' ||
        typeof product.status !== 'boolean' ||
        typeof product.stock !== 'number' ||
        typeof product.category !== 'string' ||
        typeof product.thumbnails !== 'string'
    ) {
        return res.status(400).json({ msg: 'Faltan datos obligatorios en el cuerpo de la solicitud o no son correctos' });
    }

    socketServer.sockets.emit('new_product', product)
    productManagerMongoose.save(product)

    res.status(200).send({ msg: 'Éxito' });
});

// Actualizo los datos
router.put('/:pid', (req, res) => {

    const id = req.params.pid;

    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !status || !stock || !category || !thumbnails) {
        return res.status(400).send("Faltan campos");
    } else if (
        typeof title !== 'string' ||
        typeof description !== 'string' ||
        typeof code !== 'string' ||
        typeof price !== 'number' ||
        typeof status !== 'boolean' ||
        typeof stock !== 'number' ||
        typeof category !== 'string' ||
        typeof thumbnails !== 'string'
    ) {
        return res.status(400).send("Tipo de datos incorrectos")
    }
    else {
        let modificacion = {
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        }
        productManagerMongoose.update(id, modificacion)
            .then(resp => res.send(`Producto modificado`))
            .catch(error => res.send(error))
    }
})

router.delete('/:pid', (req, res) => {

    const pid = req.params.pid;

    productManagerMongoose.delete(pid)
        .then(resp => res.send(`Producto eliminado`))
        .catch(error => res.send(error))
})

export default router;