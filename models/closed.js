const mongoose = require('mongoose')
const { plugin } = require('../lib/database')
const { Schema } = mongoose

let schema = new Schema({
    date: { type: Date, required: true }

}).plugin(plugin)

module.exports = mongoose.model('Closed', schema)