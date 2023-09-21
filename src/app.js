import express from 'express'
import productsRouter from './routes/products.router.js'
import cartsRoutes from './routes/carts.router.js'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import viewRouter from './routes/views.router.js'
import { Server } from 'socket.io'

const app = express()

const httpServer = app.listen(8080, () => {
    console.log('servidor corriendo en el puerto 8080')
})
export const socketServer = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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


})



