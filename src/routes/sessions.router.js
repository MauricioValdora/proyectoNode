import { Router } from 'express'
import userModel from '../dao/models/users.model.js'

const router = Router()

router.post('/register', async (req, res) => {

    try {
        const { first_name, last_name, email, age, password } = req.body
        const exist = await userModel.findOne({ email })

        if (exist) {
            return res.status(400).send({ status: 'error' })
        }
        await userModel.create({
            first_name,
            last_name,
            email,
            age,
            password
        })
        res.status(201).send({ status: "success" })
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }

})

router.post('/login', async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await userModel.findOne({ email, password })
        console.log('-------------' + user)
        if (!user && email !== 'adminCoder@coder.com' && password !== 'adminCod3r123') {
            return res.status(404).send({ status: 'error' })
        }
        if (user) {
            req.session.user = {
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                age: user.age,
                rol: user.rol
            }
        }
        if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
            req.session.user = {
                name: 'Sr Admin',
                email,
                rol: 'admin'
            }
        }
        return res.send({ statuss: 'success' })
    }
    catch (error) {
        res.status(500).send({ status: 'error', message: 'Login fail' })
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) return res.status(500).send({ status: 'error', error: 'fail' })
        res.redirect('/')
    })
})

export default router;