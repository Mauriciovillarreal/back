const express = require('express')
const SessionController = require('../../controller/session.controller.js')
const  { auth } = require('../../middlewares/auth.middleware.js')

const sessionsRouter = express.Router()

const {
  githubAuth,
  githubCallback,
  getCurrentUser,
  login,
  register,
  logout
} = SessionController

sessionsRouter.get('/github', githubAuth)
sessionsRouter.get('/githubcallback', githubCallback)
sessionsRouter.get('/current', getCurrentUser)
sessionsRouter.post('/login', login)
sessionsRouter.post('/register', register)
sessionsRouter.get('/logout', logout)

module.exports = sessionsRouter
