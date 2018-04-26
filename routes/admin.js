var Admin = require('../models/admin')


module.exports = function(app) {

    app.get('/admin', function(req, res) {
        res.render('../views/management.html')
    })

    app.get('/admin/signin', function(req, res) {
        res.render('signin.html', {
            errorMessages: req.flash('err')
        })
    })
    app.post('/admin/signin', function(req, res) {
        // 尋找傳過來的 username password 在資料庫中是否存在
        var data = req.body
        Admin.findOne({ username: data.username, password: data.password }, function(err, pass) {
            if (pass) {
                res.redirect('/admin')
            } else {
                res.redirect('back')
            }
        })
    })
    app.get('/admin/signup', function(req, res) {

        res.render('signup.html', {
            errorMessages: req.flash('err')
        })
    })
    app.post('/admin/signup', function(req, res) {
        var data = req.body
        if (data.username == "" || data.password == "") {
            req.flash('err', '帳號&密碼不可空白')
            res.redirect('back')
        } else {
            Admin.findOne({ username: data.username }, function(err, exist) {
                if (exist) {
                    req.flash('err', '此帳號已使用,請重新輸入')
                    res.redirect('/admin/signup')
                } else if (data.password !== data.password2) {
                    req.flash('err', '密碼錯誤,請重新輸入!')
                    res.redirect('/admin/signup')

                } else {
                    Admin.create({ username: data.username, password: data.password });
                    console.log('add new Admin');
                    req.flash('err', '管理帳號建立成功,請登入')
                    res.redirect('/admin/signin')
                }
            })
        }
    })
}