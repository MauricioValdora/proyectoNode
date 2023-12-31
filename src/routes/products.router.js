import express, { query } from 'express'
import { socketServer } from '../app.js'
import Products from '../dao/dbManagers/products.manager.js'
const router = express.Router();

const productManagerMongoose = new Products()

router.use(express.json());

router.use(express.urlencoded({ extended: true }));

// traer todos los datos
router.get('/', async (req, res) => {

    const { limit, page, sort, queryFilter } = req.query

    const limite = limit ? parseInt(limit) : 10
    const resp = await productManagerMongoose.filtradoMasivo(page, limite, sort, queryFilter)
    res.json({
        status: 'succes',
        payload: resp.docs,
        totalPages: resp.totalPages,
        prevPage: resp.prevPage,
        nextPage: resp.nextPage,
        page: resp.page,
        hasPrevPage: resp.hasPrevPage,
        hasNextPage: resp.hasNextPage
    })
});


// Traer datos por id
router.get('/:pid', (req, res) => {
    const pId = req.params.pid;
    // console.log(pId);

    productManagerMongoose.getById(pId)
        .then(product => {
            if (!product) {
                res.status(404).send('Producto no encontrado');
            } else {
                res.send(product);
            }
        })
        .catch(error => res.status(500).send('Error interno del servidor'));
});



// Retorno los productos existentes si es que los hay
router.post('/', async (req, res) => {
    const product = req.body;

    if (
        typeof product.title !== 'string' ||
        typeof product.description !== 'string' ||
        typeof product.code !== 'number' ||
        typeof product.price !== 'number' ||
        typeof product.status !== 'boolean' ||
        typeof product.stock !== 'number' ||
        typeof product.category !== 'string' ||
        typeof product.thumbnails !== 'string'
    ) {
        return res.status(400).json({ msg: 'Faltan datos obligatorios en el cuerpo de la solicitud o no son correctos' });
    }

    socketServer.sockets.emit('new_product', product)
    const result = await productManagerMongoose.save(product)

    res.status(200).send({ msg: 'Éxito', payload: result });
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
        .then(resp => {
            if (resp) {
                res.send(`Producto eliminado`);
            } else {
                res.send('Producto no eliminado');
            }
        })
        .catch(error => res.send(error));
});

export default router;