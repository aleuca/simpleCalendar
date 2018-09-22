const mongoose = require('mongoose')
const mongoUrl = 'mongodb://localhost/meetings'

mongoose.Promise = global.Promise;
mongoose.connect(mongoUrl);

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
})

const User = mongoose.model('User', userSchema)

module.exports = {
    User
}

//add new meeting to db