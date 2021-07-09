const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String,
    role: String
});

const User = mongoose.model('UserSchema', userSchema);
module.exports = User;