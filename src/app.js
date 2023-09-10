import express from 'express'
import productsRouter from './routes/products.router.js'
import cartsRoutes from './routes/carts.router.js'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import viewRouter from './routes/views.router.js'

// import second from './utils'

// app.engine('handlebars', handlebars.engine());

const app = express()
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars')

app.use(express.static(__dirname + "/public"))

app.use('/',viewRouter)

app.use('/api/products',productsRouter)
app.use('/api/carts',cartsRoutes)

app.listen(8080,()=>{
    console.log('servidor corriendo en el puerto 8080')
})