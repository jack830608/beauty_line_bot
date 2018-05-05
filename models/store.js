const mongoose = require('mongoose')
const { plugin } = require('../lib/database')
const { Schema } = mongoose


let schema = new Schema({
    name: { type: String },
    startAt: { type: String },
    endAt: { type: String },
    bookingBlock: { type: String },
    // closeDateByMonth: [],
    // closeDateByWeek: { type: String },
    sameTimeBook: { type: Number }
    // dayOfBook: { type: Number },
}).plugin(plugin)
module.exports = mongoose.model('Store', schema)