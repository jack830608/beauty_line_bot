const About = require('../models/about')
const Store = require('../models/store')
const wrap = require('../lib/async-wrapper')

module.exports = function(app) {

    app.get('/about', wrap(async(req, res, next) => {
        let storeList = await Store.find({})
        let about = await About.findOne({})
        res.render('../views/about.html', { title: '關於我們', infoMessages: req.flash('info'), stores: storeList, about: about })
    }))

    app.post('/about', wrap(async(req, res, next) => {
        let about = await About.find({})
        let storeList = await Store.find({})
        if (about.length == 0) {
            await About.create({ introduce: req.body.introduce })
            for (i = 0; i < storeList.length; i++) {
                await Store.findOneAndUpdate({ name: storeList[i].name }, { phone: req.body.phone[i], address: req.body.address[i] })
            }
        } else {
            await About.update({ introduce: req.body.introduce })
        }
        for (i = 0; i < storeList.length; i++) {
            await Store.findOneAndUpdate({ name: storeList[i].name }, { phone: req.body.phone[i], address: req.body.address[i] })
        }
        req.flash('info', '修改成功')
        res.redirect('/about')
    }))
    app.get('/about/data', wrap(async(req, res, next) => {
        let storeList = await Store.find({})
        let about = await About.findOne({})
        res.send([storeList,about])
    }))



}