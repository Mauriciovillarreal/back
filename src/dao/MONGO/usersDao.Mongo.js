const { usersModel } = require('../../models/users.model.js')

class UsersDaoMongo {
    constructor() {
        this.model = usersModel
    }

    getUsers = async () => {
        const users = await this.model.find()
        return users
    }

    getUsersBy = async (filter) => {
        return this.model.findOne(filter)
    }

    createUser = async (newUser) => {
        const result = await this.model.create(newUser)
        return result
    }

}

module.exports = UsersDaoMongo