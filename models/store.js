const mongoose = require('mongoose')
const { plugin } = require('../lib/database')
const { Schema } = mongoose


let schema = new Schema({
    name: { type: String },
    startAt: { type: String },
    endAt: { type: String },
    bookingBlock: { type: String },
    sameTimeBook: { type: Number },
    // closeDateByMonth: [],
    // closeDateByWeek: { type: String },
    // dayOfBook: { type: Number },
}).plugin(plugin)
module.exports = mongoose.model('Store', schema)