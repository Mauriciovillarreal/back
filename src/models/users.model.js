const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    first_name: String,
    last_name: String,
    email: { 
        type: String,
        required: true
    },
    age: Number,
    password: { 
        type: String, 
        required: false
    },
    role: {
        type: String,
        default: 'user'
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'carts',
        required: true
    }
})

userSchema.pre('find', function (next) {
    this.populate('carts,cart')
    next()
})

const usersModel = model('users', userSchema)

module.exports = {
    usersModel
}