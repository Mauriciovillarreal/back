const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const GitHubStrategy = require('passport-github2').Strategy
const UsersManagerMongo = require('../dao/MONGO/usersDao.Mongo.js')
const CartsManagerMongo = require('../dao/MONGO/cartDao.Mongo.js')
const { createHash, IsValidPassword } = require('../utils/bcrypt.js')
const { objetConfig } = require('../config/index.js')

const { adminEmail, adminPassword } = objetConfig

const userService = new UsersManagerMongo()
const cartService = new CartsManagerMongo()

const initPassport = () => {
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    },
        async (req, username, password, done) => {
            const { first_name, last_name } = req.body
            try {
                let userFound = await userService.getUsersBy({ email: username })
                if (userFound) {
                    console.log('El usuario ya existe')
                    return done(null, false)
                }

                const cart = await cartService.createCart()

                let newUser = {
                    first_name,
                    last_name,
                    email: username,
                    password: createHash(password),
                    cart
                }

                let result = await userService.createUser(newUser)

                return done(null, result)

            } catch (error) {
                return done('Error al registrar: ' + error)
            }
        }
    ))

    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (username, password, done) => {
            try {
                const cart = await cartService.createCart()
                if (username === adminEmail) {
                    if (password === adminPassword) {
                        const hardcodedUser = {
                            _id: 'adminId',
                            email: adminEmail,
                            admin: true,
                            cart: cart._id
                        }
                        return done(null, hardcodedUser)
                    } else {
                        console.log("Contraseña incorrecta para la cuenta hardcodeada")
                        return done(null, false)
                    }
                }
                const user = await userService.getUsersBy({ email: username })
                if (!user) {
                    console.log("Usuario no encontrado")
                    return done(null, false)
                }
                if (!IsValidPassword(password, { password: user.password })) {
                    console.log("Contraseña incorrecta")
                    return done(null, false)
                }
                return done(null, user)
            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv23liwkJwoCQAftU16K',
            clientSecret: 'ba52dd01c3e23dc46d9b8fdc2f1b69f77830c064',
            callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await userService.getUsersBy({ email: profile._json.email })
                if (!user) {
                    const cart = await cartService.createCart()
                    let newUser = {
                        first_name: profile._json.name,
                        last_name: profile._json.name,
                        email: profile._json.email,
                        cart: cart._id
                    }
                    let result = await userService.createUser(newUser)
                    done(null, result)
                } else {
                    if (!user.cart) {
                        const cart = await cartService.createCart()
                        user.cart = cart._id
                        await userService.updateUser(user._id, { cart: cart._id })
                    }
                    done(null, user)
                }
            } catch (err) {
                return done(err)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        console.log('User to serialize:', user)
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        try {
            if (id === 'adminId') {
                const cart = await cartService.createCart() 
                const adminUser = {
                    _id: 'adminId',
                    first_name: 'Admin',
                    last_name: 'Coder',
                    email: adminEmail,
                    role: 'admin',
                    cart: cart._id
                }
                return done(null, adminUser)
            }
            let user = await userService.getUsersBy({ _id: id })
            done(null, user)
        } catch (error) {
            done(error)
        }
    })
}

module.exports = { initPassport }
