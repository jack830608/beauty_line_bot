var Store = require('../models/store')
const wrap = require('../lib/async-wrapper')
module.exports = function(app) {
    app.get('/store', wrap(async(req, res, next) => {
        let storeList = await Store.find({})
        if (storeList.length == 0) {
            req.flash('info', '請新增門市')
            res.render('../views/stores.html', { infoMessages: req.flash('info') })
        } else {
            res.render('../views/stores.html', {
                infoMessages: req.flash('info'),
                stores: storeList
            })
        }
    }))

    app.get('/store/add', wrap(async(req, res, next) => {
        res.render('../views/addstore.html', { infoMessages: req.flash('info') })
    }))
    app.post('/store/add', wrap(async(req, res, next) => {
        var data = req.body
        let re = await Store.findOne({ name: data.name })
        if (re) {
            req.flash('info', '此分店已存在')
            res.redirect('/store/add')
        } else if (data.name == "") {
            req.flash('info', '分店名稱不可空白')
            res.redirect('/store/add')
        } else {
            Store.create({
                name: data.name,
                sameTimeBook: data.sameTimeBook
            });
            console.log('add new Store');
            req.flash('info', '門市新增成功')
            res.redirect('/store')
        }
    }))
    app.get('/store/update/:id', wrap(async(req, res, next) => {
        let c = await Store.findOne({ _id: req.params.id })
        res.render('../views/updatestore.html', {
            storeId: c._id,
            storename: c.name,
            storenum: c.sameTimeBook,
            infoMessages: req.flash('info')
        })
    }))
    app.post('/store/update/:id', wrap(async(req, res, next) => {
        if (req.body.newname == "") {
            req.flash('info', '分店名稱不可空白')
            res.redirect('back')
        } else {
            let c = await Store.findOne({ _id: req.params.id })
            var query = { name: c.name, sameTimeBook: c.sameTimeBook };
            var updateData = {
                name: req.body.newname,
                sameTimeBook: req.body.newsameTimeBook
            };
            await Store.update(query, updateData);
            console.log('Update success!');
            req.flash('info', '門市更新成功')
            res.redirect('/store')
        }
    }))
    app.post('/store/delete/:id', wrap(async(req, res, next) => {
        await Store.remove({ _id: req.params.id })
        console.log('Delete success!');
        req.flash('info', '門市刪除成功')
        res.redirect('/store')
    }))
    app.get('/store/init', wrap(async(req, res, next) => {
        let storeList = await Store.find({})
        if (storeList.length == 0) {
            req.flash('info', '請先新增門市')
            res.redirect('/store/add')
        } else {
            res.render('../views/initstore.html', {
                stores: storeList,
                infoMessages: req.flash('info')
            })
        }
    }))
    app.post('/store/init', wrap(async(req, res, next) => {
        if (Number(req.body.startAt) > Number(req.body.endAt)) {
            req.flash('info', '結束時間不可小於開始時間')
            res.redirect('/store/init')
        } else {
            let storeL = await Store.findOne({ name: req.body.name })
            let storeInit = {
                startAt: storeL.startAt,
                endAt: storeL.endAt,
                bookingBlock: storeL.bookingBlock,
                dayOfBook: storeL.dayOfBook,
            };
            let initData = {
                startAt: req.body.startAt,
                endAt: req.body.endAt,
                bookingBlock: req.body.bookingBlock,
                dayOfBook: req.body.dayOfBook,
            };
            let month = { closeDateByMonth: req.body.closeDateByMonth }
            let findmonth = { closeDateByMonth: storeL.closeDateByMonth }
            let week = { closeDateByWeek: req.body.closeDateByWeek }
            let findweek = { closeDateByWeek: storeL.closeDateByWeek }
            if (req.body.checkMonth) {
                await Store.update(findmonth, month)
            }
            if (req.body.checkWeek) {
                await Store.update(findweek, week)
            }
            await Store.update(storeInit, initData)
            console.log('init success')
            req.flash('info', '門市初始化修改成功')
            res.redirect('/store')
        }
    }))


}