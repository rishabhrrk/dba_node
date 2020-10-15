const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    author: String,
    post: String,
    timeStamp: { type : Date, default: Date.now }
})

module.exports = mongoose.model('posts', postSchema)