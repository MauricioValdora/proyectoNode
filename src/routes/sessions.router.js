import { Router } from 'express'
// import userModel from '../dao/models/users.model.js'
// import { createHash, isValidPasword } from '../utils.js'
import passport from 'passport'

const router = Router()

router.post('/register', passport.authenticate('register', { failureRedirect: '/fail-register' }), async (req, res) => {

    res.send({ status: 'succes', message: 'Usuario registrado :D' })

})

router.get('/fail-register', async (req, res) => {
    console.log('fail register')
    res.status(500).send({ error: "fail :P" })
})


router.post('/login', passport.authenticate('login', { failureRedirect: '/fail-login' }), async (req, res) => {

    if (!req.user) {
        return res.status(401).send({ status: 'error', message: 'incorrect credentials' })
    }

    if (req.user) {
        req.session.user = {
            name: `${req.user.first_name} ${req.user.last_name}`,
            rol: req.user.rol
        }
    }

    res.send({ status: 'success', message: 'login success' })

})

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
    res.send({ status: 'succes', message: 'user registered' })
})

router.get('/github-callback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {

    req.session.user = {
        name: `${req.user.first_name} ${req.user.last_name}`,
        rol: req.user.rol
    }

    res.redirect('/products')
})

router.get('/fail-login', async (req, res) => {
    console.log('fail login')
    res.status(500).send({ error: "fail :P" })
})

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) return res.status(500).send({ status: 'error', error: 'fail' })
        res.redirect('/')
    })
})

export default router;