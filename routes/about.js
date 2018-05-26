const About = require('../models/about')
const Store = require('../models/store')
const wrap = require('../lib/async-wrapper')

module.exports = function(app) {

    app.get('/about', wrap(async(req, res, next) => {
        let about = await About.findOne({})
        res.render('../views/about.html', { title: '關於我們', infoMessages: req.flash('info'), about: about })
    }))

    app.post('/about', wrap(async(req, res, next) => {

        let about = await About.find({})
        if (about.length == 0) {
            await About.create({ introduce: req.body.introduce })
        } else {
            await About.update({ introduce: req.body.introduce })
        }
        req.flash('info', '儲存成功')
        res.redirect('/about')
    }))
    
    app.get('/aboutus', wrap(async(req, res, next) => {
        let about = await About.findOne({})
        res.render('../views/aboutus.html', { about: about })
    }))


}