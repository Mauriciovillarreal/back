const { Schema, model } = require('mongoose')
const mongoosePagiante = require('mongoose-paginate-v2')

const productsSchema = new Schema ({
    brands: String,
    name: String,
    description: String,
    code: String,
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    thumbnails: String,
})

productsSchema.plugin(mongoosePagiante)

const productsModel = model('products', productsSchema)

module.exports = {
    productsModel
}

