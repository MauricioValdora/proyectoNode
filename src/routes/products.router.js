import express from 'express'
import fs from 'fs'
import ProductManager from '../utils/ProductManager.js'

const router = express.Router();

router.use(express.json());

router.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager()

// traer todos los datos
router.get('/', (req, res) => {

    const path = './productos.json';

    const { limit } = req.query
    const products = JSON.parse(productManager.getProducts(path))
    let datos;
    if (limit <= products.length) {
        datos = products.slice(0, limit)
    } else {
        datos = products;
    }
    res.json({ data: datos })
})

// Traer datos por id
router.get('/:pid', (req, res) => {

    const pId = parseInt(req.params.pid);
    const path = './productos.json';

    try {
        const productById = productManager.getProductsById(pId,path);

        if (productById) {
            res.send(productById);
        } else {
            res.status(404).send(`El id ${pId} no existe en la base de datos`);
        }
    } catch (error) {
        res.status(500).send('Ocurrió un error al buscar el producto');
    }
});

// Genero id para los post
function generateId() {
    const time = new Date().getTime();
    return time
}

// Retorno los productos existentes si es que los hay
router.post('/', (req, res) => {
    const product = req.body;
    const path = './productos.json';

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

    fs.readFile(path, 'utf8', (err, data) => {
        let products = [];

        if (!err) {
            try {
                products = JSON.parse(data);
            } catch (error) {
                console.error('Error al analizar los datos JSON existentes:', error);
                return res.status(500).send({ msg: 'Error al analizar los datos JSON existentes' });
            }
        }

        product.id = generateId()

        products.push(product);

        fs.writeFile(path, JSON.stringify(products), (err) => {
            if (err) {
                console.error('Error al guardar los datos:', err);
                return res.status(500).send({ msg: 'Error al guardar los datos' });
            }

            console.log('El producto que se agregó:', product);
            res.status(200).send({ msg: 'Éxito' });
        });
    });
});

// Actualizo los datos
router.put('/:pid', (req, res) => {

    const path = './productos.json';

    const id = parseInt(req.params.pid);

    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    if(!title|| !description|| !code|| !price|| !status|| !stock|| !category|| !thumbnails){
        return res.status(400).send("Faltan campos");
    }else if(
        typeof title !== 'string' ||
        typeof description !== 'string' ||
        typeof code !== 'string' ||
        typeof price !== 'number' ||
        typeof status !== 'boolean' ||
        typeof stock !== 'number' ||
        typeof category !== 'string' ||
        typeof thumbnails !== 'string'
    ){
        return res.status(400).send("Tipo de datos incorrectos")
    }
    else{

        const productList = productManager.getProducts(path);
        const productParse = JSON.parse(productList);
    
        const productIndex = productParse.findIndex(p => p.id === id);
    
        let modificacion = {
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails,
            id
        }
        if (productIndex !== -1) {
            productParse[productIndex] = modificacion;
    
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
    }

})

router.delete('/:pid',(req,res)=>{

    const pid = parseInt(req.params.pid);
    const path = './productos.json'

    const respuesta = productManager.deleteProduct(pid,path)

    if(respuesta===1){
        res.send("producto eliminado exitosamente")
    }else if(respuesta===-1){
        res.send('Error al eliminar el producto')
    }else if(respuesta===0){
        res.send("Producto no entontrado")
    }

})

export default router;