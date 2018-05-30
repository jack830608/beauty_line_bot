const Store = require('../models/store')
const wrap = require('../lib/async-wrapper')
module.exports = function(app) {
    app.get('/store', wrap(async(req, res, next) => {
        let storeList = await Store.find({})
        if (storeList.length == 0) {
            req.flash('info', '請新增門市')
            res.render('../views/stores.html', { infoMessages: req.flash('info'), title: '門市管理' })
        } else {
            res.render('../views/stores.html', {
                infoMessages: req.flash('info'),
                stores: storeList,
                title: '門市管理'
            })
        }
    }))

    app.get('/store/add', wrap(async(req, res, next) => {
        res.render('../views/addstore.html', { infoMessages: req.flash('info'), title: '新增門市' })
    }))
    app.post('/store/add', wrap(async(req, res, next) => {
        let re = await Store.findOne({ name: req.body.name })
        if (re) {
            req.flash('info', '此分店已存在')
            res.redirect('/store/add')
        } else if (req.body.name == "") {
            req.flash('info', '分店名稱不可空白')
            res.redirect('/store/add')
        } else {
            Store.create({
                name: req.body.name,
                sameTimeBook: req.body.sameTimeBook
            });
            console.log('add new Store');
            req.flash('info', '門市新增成功')
            res.redirect('/store')
        }
    }))
    app.get('/store/update/:id', wrap(async(req, res, next) => {
        let storeData = await Store.findOne({ _id: req.params.id })
        // let week=["無","星期一","星期二","星期三","星期四","星期五","星期六","星期日"]
        res.render('../views/updatestore.html', {
            storeId: storeData._id,
            storename: storeData.name,
            storenum: storeData.sameTimeBook,
            storeStart: storeData.startAt,
            storeEnd: storeData.endAt,
            storeBookingBlock: storeData.bookingBlock,
            // storeDayOfBook:storeData.dayOfBook,
            // storeCloseDateByMonth: storeData.closeDateByMonth,
            // storeCloseDateByWeekOri: storeData.closeDateByWeek,
            // storeCloseDateByWeek: week[storeData.closeDateByWeek],
            infoMessages: req.flash('info'),
            title: '管理門市'
        })
    }))

    app.post('/store/update/:id', wrap(async(req, res, next) => {
        let sameName = await Store.findOne({ name: req.body.newname }) || false
        let findStore = await Store.findOne({ _id: req.params.id })
        let query = { name: findStore.name, sameTimeBook: findStore.sameTimeBook };
        let updateData = {
            name: req.body.newname,
            sameTimeBook: req.body.newsameTimeBook,
            startAt: req.body.startAt,
            endAt: req.body.endAt,
            bookingBlock: req.body.bookingBlock
            // dayOfBook: req.body.dayOfBook,
            // closeDateByMonth: req.body.closeDateByMonth,
            // closeDateByWeek: req.body.closeDateByWeek
        };
        if (req.body.newname == "") {
            req.flash('info', '分店名稱不可空白')
            res.redirect('back')
        } else if (findStore.name == sameName.name) {
            if (Number(req.body.startAt) >= Number(req.body.endAt)) {
                req.flash('info', '結束時間不可以小於或等於開始時間')
                res.redirect('back')
            } else {
                await Store.update(query, updateData);
                console.log('Update success!');
                req.flash('info', '門市更新成功')
                res.redirect('/store')
            }
        } else if (sameName) {
            req.flash('info', '分店名稱不可重複')
            res.redirect('back')
        } else if (Number(req.body.startAt) >= Number(req.body.endAt)) {
            req.flash('info', '結束時間不可以小於或等於開始時間')
            res.redirect('back')
        } else {
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


}