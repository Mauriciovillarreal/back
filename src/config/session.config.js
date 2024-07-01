const session = require('express-session')
const passport = require('passport')
const MongoStore = require('connect-mongo')
const { initPassport } = require('../../src/config/passport.config.js')
const { objetConfig } = require('../config/index.js')

const { session_secret } = objetConfig

const initSession = (app, mongoUrl) => {
    app.use(session({
      store: MongoStore.create({
        mongoUrl,
        mongoOptions: {
          useNewUrlParser: true,
          useUnifiedTopology: true
        },
        ttl: 60 * 60 * 1000 * 24
      }),
      secret: session_secret,
      resave: true,
      saveUninitialized: false, // Ensure sessions are only saved if modified
      cookie: { secure: false, httpOnly: true } // Adjust secure setting for local development
    }));
  
    initPassport();
    app.use(passport.initialize());
    app.use(passport.session());
  
    app.use((req, res, next) => {
      next();
    });
  };
  
 

module.exports = { initSession }
