const Init = require('../models/init')
const wrap = require('../lib/async-wrapper')
module.exports = function(app) {

    app.get('/init', wrap(async(req, res, next) => {
        let initList = await Init.findOne({})
        let week = ["無", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"]
        res.render('../views/init.html', { title: '初始化修改', init: initList,weeks:week[initList.closeDateByWeek],infoMessages: req.flash('info') })

    }))

    app.post('/init', wrap(async(req, res, next) => {
        let initList = await Init.findOne({})
        if (initList) {
            await Init.update({
                closeDateByMonth: initList.closeDateByMonth,
                closeDateByWeek: initList.closeDateByWeek,
                dayOfBook: initList.dayOfBook
            }, {
                closeDateByMonth: req.body.closeDateByMonth,
                closeDateByWeek: req.body.closeDateByWeek,
                dayOfBook: req.body.dayOfBook
            })
            console.log('init store success')
            req.flash('info', '初始化修改成功')
            res.redirect('/init')
        } else {
            await Init.create({
                closeDateByMonth: req.body.closeDateByMonth,
                closeDateByWeek: req.body.closeDateByWeek,
                dayOfBook: req.body.dayOfBook
            })
            console.log('init store success')
            req.flash('info', '初始化修改成功')
            res.redirect('/init')
        }
    }))


}