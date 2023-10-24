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
        const {email,password} = req.body
        const user = await userModel.findOne({email,password})

        if(!user){
            return res.status(400).send({status:'error'})
        }
        console.log(user)
        req.session.user = {
            name:`${user.first_name} ${user.last_name}`,
            email:user.email,
            age:user.age
        }
        console.log(`esta es la session ${req.session.user}`)

        res.send({statuss:'success'})

    } catch (error) {
        res.status(500).send({ status: 'error', message: 'register fail' })
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) return res.status(500).send({ status: 'error', error: 'fail' })
        res.redirect('/')
    })
})

export default router;