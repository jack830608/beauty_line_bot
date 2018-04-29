const mongoose = require('mongoose')
const { plugin } = require('../lib/database')
const { Schema } = mongoose


let schema = new Schema({
    date: { type: String },
    startAt: { type: String },
    endAt: { type: String },
    phone: { type: String },
    name: { type: String },
    note: { type: String },
    code: { type: String },
    cancel: { type: Boolean, default: false },
}).plugin(plugin)

module.exports = mongoose.model('Order', schema)