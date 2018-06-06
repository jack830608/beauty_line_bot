var Closed = require('../models/closed')
const wrap = require('../lib/async-wrapper')

module.exports = function(app) {
    app.get('/closed', wrap(async(req, res, next) => {
        if (req.session.admin) {
            // var start = new Date()
            // start.setHours(0, 0, 0, 0)
            var closed = await Closed.find({}).sort({ date: 1 })
            res.render('../views/closed.html', { title: '店休設定', infoMessages: req.flash('info'), closed: closed })
        } else {
            req.flash('err', '請先登錄')
            res.redirect('/admin/signin')
        }
    }))

    app.get('/closed/date', wrap(async(req, res, next) => {
        res.render('../views/closeddate.html')
    }))


    app.get('/closed/list', wrap(async(req, res, next) => {
        let closedList = await Closed.find({})
        res.send(closedList)

    }))

    app.post('/closedbydate', wrap(async(req, res, next) => {
        await Closed.create({ date: req.body.date })
        req.flash('info', '新增成功')
        res.redirect('/closed')
    }))

    app.post('/closed/:id/delete', wrap(async(req, res, next) => {
        await Closed.remove({ _id: req.params.id })
        req.flash('info', '取消成功')
        res.redirect('/closed')
    }))

}