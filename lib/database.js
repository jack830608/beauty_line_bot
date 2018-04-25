const mongoose = require('mongoose')
const mongooseLeanId = require('mongoose-lean-id')

mongoose.Promise = Promise

module.exports.plugin = (schema) => {
  schema.add({
    created: {
      type: Date,
      default: Date.now // 如果寫成 new Date() or Date.now(), 都會把 server 啟動時的執行結果當做預設值 
    },
    updated: {
      type: Date,
      default: Date.now
    },
  })

  schema.pre('save', function (next) {
    this.updated = Date.now()
    next()
  })

  schema.pre('update', function (next) {
    this.update({}, { updated: Date.now() });
    next()
  })

  schema.pre('findOneAndUpdate', function (next) {
    this.findOneAndUpdate({}, { updated: Date.now() });
    next()
  })

  function transform(doc, ret, options) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    return ret
  }

  schema.set('toObject', Object.assign({}, schema.options.toObject, { transform }))
  schema.set('toJSON', Object.assign({}, schema.options.toJSON, { transform }))
  schema.plugin(mongooseLeanId)
}

module.exports.connect = () => {
  return new Promise((resolve, reject) => {
    let uri = process.env.MONGO_URL || 'mongodb://127.0.0.1/beauty_line_bot'
    let conn = mongoose.connection

    // If the connection throws an error
    conn.on('error', (err) => {
      console.log('Mongoose default connection error: ' + err)
      reject(err)
    })

    conn.once('open', () => {
      console.log('Mongoose default connection open to ' + uri)
      resolve()
    })

    // When the connection is disconnected
    conn.on('disconnected', function () {
      console.log('Mongoose default connection disconnected')
    })

    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', function () {
      conn.close(function () {
        console.log('Mongoose default connection disconnected through app termination')
        process.exit(0)
      })
    })

    mongoose.connect(uri)
  })
}