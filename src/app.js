import express from 'express'
import productsRouter from './routes/products.router.js'
import cartsRoutes from './routes/carts.router.js'

const app = express()
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.get('/',(req,res)=>{
    res.send('hola gracias por entrar a la pagina')
})
app.use('/api/products',productsRouter)
app.use('/api/carts',cartsRoutes)

app.listen(8080,()=>{
    console.log('servidor corriendo en el puerto 8080')
})