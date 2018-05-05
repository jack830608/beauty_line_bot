const mongoose = require('mongoose')
const { plugin } = require('../lib/database')
const { Schema } = mongoose


let schema = new Schema({
    closeDateByMonth: [],
    closeDateByWeek: { type: String },
    dayOfBook: { type: Number },
}).plugin(plugin)
module.exports = mongoose.model('Init', schema)