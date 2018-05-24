const mongoose = require('mongoose')
const { plugin } = require('../lib/database')
const { Schema } = mongoose

let schema = new Schema({
    introduce: { type: String, required: true }
}).plugin(plugin)

module.exports = mongoose.model('About', schema)