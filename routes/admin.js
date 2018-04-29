var Admin = require('../models/admin')
const wrap = require('../lib/async-wrapper')

module.exports = function(app) {

    app.get('/admin', function(req, res) {
        res.render('../views/base.html')
    })

    app.get('/admin/signin', function(req, res) {
        res.render('signin.html', {
            errorMessages: req.flash('err')
        })
    })

    app.post('/admin/signin', wrap(async(req, res, next) => {
        let pass = await Admin.findOne({ username: req.body.username, password: req.body.password })
        if (pass) {
            res.redirect('/admin')
        } else {
            res.redirect('back')
        }
    }))

    app.get('/admin/signup', wrap(async(req, res, next) => {
        res.render('signup.html', { errorMessages: req.flash('err') })
    }))

    app.post('/admin/signup', wrap(async(req, res, next) => {
        if (req.body.username == "" || req.body.password == "") {
            req.flash('err', '帳號&密碼不可空白')
            res.redirect('back')
        } else {
            let exist = await Admin.findOne({ username: req.body.username })
            if (exist) {
                req.flash('err', '此帳號已使用,請重新輸入')
                res.redirect('/admin/signup')
            } else if (req.body.password !== req.body.password2) {
                req.flash('err', '密碼錯誤,請重新輸入!')
                res.redirect('/admin/signup')
            } else {
                Admin.create({ username: req.body.username, password: req.body.password });
                console.log('add new Admin');
                req.flash('err', '管理帳號建立成功,請登入')
                res.redirect('/admin/signin')
            }
        }
    }))
}