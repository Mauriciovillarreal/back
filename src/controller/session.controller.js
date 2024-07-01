const passport = require('passport')

class SessionController {
    githubAuth = passport.authenticate('github', { scope: 'user:email' }, async (req, res) => { })

    githubCallback = (req, res, next) => {
        passport.authenticate('github', { failureRedirect: '/login' }, (err, user) => {
            if (err) {
                console.error('Error en autenticación de GitHub:', err)
                return res.status(500).json({ message: 'Authentication error' })
            }
            if (!user) {
                console.log('No se encontró usuario')
                return res.redirect('/login')
            }
            req.logIn(user, (err) => {
                if (err) {
                    console.error('Error al iniciar sesión:', err)
                    return res.status(500).json({ message: 'Login error' })
                }
                console.log('Sesión iniciada correctamente:', user)
                req.session.user = user
                return res.redirect('http://localhost:5173/')
            })
        })(req, res, next)
    }


    getCurrentUser = async (req, res) => {
        console.log('Checking authentication for current user')
        if (req.isAuthenticated()) {
            console.log('User is authenticated:', req.user)
            res.json({ user: req.user })
        } else {
            console.log('User is not authenticated')
            res.status(401).json({ error: 'Not authenticated' })
        }
    }


    login = (req, res, next) => {
        passport.authenticate('login', (error, user, info) => {
            if (error) {
                console.log('Server error:', error)
                return res.status(500).json({ error: 'Internal Server Error' })
            }
            if (!user) {
                console.log('Authentication failed: incorrect email or password')
                return res.status(401).json({ error: 'Email or password incorrect' })
            }
            req.logIn(user, (error) => {
                if (error) {
                    console.log('Login error:', error)
                    return res.status(500).json({ error: 'Internal Server Error' })
                }
                console.log('Login successful:', { first_name: user.first_name, cart: user.cart })
                return res.status(200).json({ message: 'Login successful', first_name: user.first_name, email: user.email, role: user.role, last_name: user.last_name, cart: user.cart })
            })
        })(req, res, next)
    }



    register = (req, res, next) => {
        passport.authenticate('register', (error, user, info) => {
            if (error) {
                return next(error)
            }
            if (!user) {
                req.session.error = 'Error registering user'
                return res.redirect('/register')
            }
            req.logIn(user, (error) => {
                if (error) {
                    return next(error)
                }
                return res.redirect('/login')
            })
        })(req, res, next)
    }

    logout = (req, res) => {
        req.session.destroy(error => {
            if (error) {
                return res.status(500).json({ status: 'error', error: error.message })
            } else {
                return res.status(200).json({ status: 'success', message: 'Logout successful' })
            }
        })
    }

}

module.exports = new SessionController()
