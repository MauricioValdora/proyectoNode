import fs from 'fs';


class ProductManager {
    constructor() {
        this.products = [];
        this.id = 0
    }

    async addProducts(title, description, price, thumbNail, code, stock , path) {

        if (!title || !description || !price || !thumbNail || !code || !stock) {
            console.error('ALL FIELDS ARE REQUIRED');
            return;
        }

        if (this.products.find(product => product.code === code)) {
            return console.error('PRODUCT ALREADY EXISTS');

        }

        this.id++;
        const product = {
            id: this.id,
            title,
            description,
            price,
            thumbNail,
            code,
            stock
        };

        this.products.push(product);
        try {

            fs.writeFileSync(path, JSON.stringify(this.products))

        } catch (error) {
            console.error(error);
        }

    }
    getProducts(path) {
        if (fs.existsSync(path)) {
            try {
                let productList = fs.readFileSync(path, 'utf-8');
                return productList;
            } catch (error) {
                console.error('Error al leer el archivo:', error);
                return this.products;
            }
        } else {
            return this.products;
        }
    }

    getProductsById(id,path) {
        let productList = fs.readFileSync(path, 'utf-8');

        let productParse = JSON.parse(productList)

        const product = productParse.find(p => p.id === id);

        if (product) {
            return product;
        } else {
            console.error('PRODUCT NOT FOUND');
            return null;
        }
    }

    updateProduct(id, campoModificar, modificacion) {

        if (!campoModificar) {
            console.error('Campo a modificar no especificado');
            return;
        }

        const productList = this.getProducts();
        const productParse = JSON.parse(productList);

        const productIndex = productParse.findIndex(p => p.id === id);

        if (productIndex !== -1) {
            productParse[productIndex][campoModificar] = modificacion;

            try {
                fs.writeFileSync(this.path, JSON.stringify(productParse));
                console.log('Campo actualizado exitosamente.');
            } catch (error) {
                console.error('Error al actualizar el campo:', error);
            }
        } else {
            console.error('PRODUCT NOT FOUND');
        }
    }

    deleteProduct(id,path) {
        const productList = this.getProducts(path);
        const productParse = JSON.parse(productList);

        const productIndex = productParse.findIndex(p => p.id === id);

        if (productIndex !== -1) {
            productParse.splice(productIndex, 1);

            try {
                fs.writeFileSync(path, JSON.stringify(productParse));
                console.log('Producto eliminado exitosamente.');
                return 1
            } catch (error) {
                console.error('Error al eliminar el producto:', error);
                return -1
            }
        } else {
            console.error('PRODUCT NOT FOUND');
            return 0
        }
    }


}

export default ProductManager

// const productManager = new ProductManager();

// productManager.addProducts(
//     "producto prueba 1",
//     "este es un producto de prueba 1",
//     200,
//     "sin imagen",
//     "abc123",
//     25
// );

// productManager.addProducts(
//     "producto prueba 2",
//     "este es un producto de prueba 2",
//     300,
//     "sin imagen",
//     "abc1234",
//     10
// );
// productManager.addProducts(
//     "producto prueba 3",
//     "este es un producto de prueba 2",
//     300,
//     "sin imagen",
//     "abc1231234",
//     10
// );

// console.log(productManager)
// console.log(productManager.getProducts());
// console.log(productManager.getProductsById(1));
// console.log(productManager.getProductsById(3));
// productManager.updateProduct(1, 'title', 'Nuevo Título');
// console.log(productManager.deleteProduct(1))

