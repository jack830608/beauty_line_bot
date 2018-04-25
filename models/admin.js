const mongoose = require('mongoose')
const { plugin } = require('../lib/database')
const { Schema } = mongoose

let schema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
}).plugin(plugin)

module.exports = mongoose.model('Admin', schema)