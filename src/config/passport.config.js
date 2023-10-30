import passport from 'passport'
import GithubStrategy from 'passport-github2'
import local from 'passport-local'
import userModel from '../dao/models/users.model.js'
import { createHash, isValidPasword } from '../utils.js'

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            const { first_name, last_name, age } = req.body;
            try {
                console.log(username, password)
                let user = await userModel.findOne({ email: username })
                if (user) {
                    console.log('ya hay un ususario con ese email')
                    return done(null, false)
                }
                const newUser = {
                    first_name,
                    last_name,
                    email: username,
                    age,
                    password: createHash(password)
                }
                let result = await userModel.create(newUser)
                return done(null, result)
            } catch (error) {
                return done("Error al obtener el usuario" + error)
            } 
        }
    ))

    passport.use('login', new LocalStrategy(
        { usernameField: 'email' }, async (username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username })
                if (user) {
                    if (!isValidPasword(user, password)) return done(null, false)
                    return done(null, user)
                }
                // else if (username === 'adminCoder@coder.com' && password === 'adminCod3r123') {
                //     let user = {
                //         first_name: 'Sr Admin',
                //         rol: 'admin'
                //     }
                //     return done(null, user);
                // }
            }
            catch (error) {
                return done(`Error al retornar el usuario ${error.message}`)
            }
        }
    ))

    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.3090d1b6cc44eea4',
        clientSecret: '68bc8622780b959b9b8e3e22e442bfc8d4717146',
        callbackURL: 'http://localhost:8080/api/sessions/github-callback',
        scope: ['user:email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile)
            const email = profile.emails[0].value

            const user = await userModel.findOne({ email })

            if (!user) {
                const newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: 18,
                    email,
                    password: ''
                };

                const result = await userModel.create(newUser)
                return done(null, result)

            } else {
                return done(null, user)
            }
        } catch (error) {
            return done(error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })

}
export default initializePassport