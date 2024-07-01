const { connect } = require('mongoose')
const { objetConfig } = require('../config/index.js')

const { mongo_url } = objetConfig

console.log('Config:', objetConfig)

class MongoSingleton {
    static #instance
    constructor() {
        connect(mongo_url)
    }

    static getInstance() {
        if (this.#instance) {
            console.log('BD ya esta conectada')
            return this.#instance
        }
        this.#instance = new MongoSingleton()
        console.log('BD conectada')
        return this.#instance
    }
}

module.exports = MongoSingleton