const express = require('express')
const cookieParser = require('cookie-parser')
const { connectDB, objetConfig } = require('./config/index.js')
const { initSession } = require('./config/session.config.js')
const { initSocket } = require('./config/socket.config.js')
const routerApp = require('./routes/index.js')
const cors = require('cors');

const { port, mongo_url, cookie_parser_secret } = objetConfig

const app = express()
const httpServer = app.listen(port, error => {
    if (error) console.log(error)
    console.log('Server escuchando en el puerto ' + port)
})

connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser(cookie_parser_secret))
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

initSession(app, mongo_url)

app.use(routerApp)

initSocket(httpServer)
