import express from 'express'
import productsRouter from './routes/products.router.js'
import cartsRoutes from './routes/carts.router.js'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import viewRouter from './routes/views.router.js'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import MessageManager from './/dao/dbManagers/messages.manager.js'

const messageManager = new MessageManager()
const app = express()

const httpServer = app.listen(8080, () => {
    console.log('servidor corriendo en el puerto 8080')
})
export const socketServer = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars')

app.use(express.static(__dirname + "/public"))

app.use('/', viewRouter)

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRoutes)


socketServer.on('connection', socket => {

    console.log('nuevo cliente conectado');

    socket.on('new_product', data => {
        socket.emit('new_product', data);
    })

    socket.on('delete_product', data => {
        socket.emit('delete_product', data);
    })

    socket.on('message', (msg) => {

        messageManager.save(msg)

        messageManager.getAll()
            .then((mensajes) => { socketServer.emit('chat_message', mensajes) })
            .catch((error) => console.log(error))

    });

})

try {
    await mongoose.connect('mongodb+srv://mauricio:valdora@clustermaury.y8wiux9.mongodb.net/ecomerce')
    console.log('base de datos conectada perfectamente');
} catch (error) {
    console.log(error.message)
}


