const socket = io();
socket.on('new_product', async product => {
    console.log('socket: ', product)

    const productList = document.getElementById('product-list');

    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <h2>${product.title}</h2>
        <p>Descripción: ${product.description}</p>
        <p>Código: ${product.code}</p>
        <p>Precio: ${product.price}</p>
        <p>Stock: ${product.stock}</p>
        <p>Categoría: ${product.category}</p>
        <p>Estado: ${product.status ? 'Disponible' : 'No disponible'}</p>
    `;
    productList.appendChild(listItem);
})


socket.on('delete_product', data => {
    console.log(data);
    const items = document.querySelectorAll('.item');
    const productList = document.getElementById('product-list');

    for (let i = 0; i < items.length; i++) {
        if (items[i].id == data.idProducto) {
            productList.removeChild(items[i]);
            break;
        }
    }
});

