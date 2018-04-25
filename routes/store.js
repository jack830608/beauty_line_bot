var Store = require('../models/store')

module.exports = function(app) {
    app.get('/store', function(req, res) {
        Store.find({}, function(err, c) {
            if (c == null) {
                res.render('../views/addstore.html')
            } else {
                res.render('../views/store.html', {
                    infoMessages: req.flash('info'),
                    QQ: c
                })
            }
        })
    })

    app.get('/store/add', function(req, res) {
        res.render('../views/addstore.html', { infoMessages: req.flash('info') })
    });
    app.post('/store/add', function(req, res) {
        var data = req.body
        console.log(data)
        Store.create({
            name: data.name,
            startAt: data.startAt,
            endAt: data.endtAt,
            bookingBlock: data.bookingBlock,
            closeDateByMonth: data.closeDateByMonth,
            closeDateByWeek: data.closeDateByWeek,
            sameTimeBook: data.sameTimeBook,
            dayOfBook: data.dayOfBook
        });
        console.log('add new Store');
        req.flash('info', '門市新增成功')
        res.redirect('/store')
    })
    app.get('/store/update/:id', function(req, res) {
        // console.log(req.params.id)
        Store.findOne({ name: req.params.id }, function(err, c) {
            res.render('../views/updatestore.html', { storename: c.name, storenum: c.sameTimeBook })
        })
    });

    app.post('/store/update/:id', function(req, res) {
        Store.findOne({ name: req.params.id }, function(err, c) {
            if (c == null) {
                res.redirect('/store')
            } else {
                var conditions = { name: c.name, sameTimeBook: c.sameTimeBook };
                var update = { name: req.body.newname, sameTimeBook: req.body.newsameTimeBook };
                Store.update(conditions, update, function(error) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Update success!');
                        req.flash('info', '門市更新成功')
                        res.redirect('/store')
                    }
                })
            }
        })
    })
    app.post('/store/delete/:id', function(req, res) {
        Store.findOne({ name: req.params.id }, function(err, docs) {
            if (docs == null) {
                res.redirect('/store')
            } else {
                docs.remove();
                console.log('Delete success!');
                req.flash('info', '門市刪除成功')
                res.redirect('/store')
            }
        });
    })


}