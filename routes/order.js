const Order = require('../models/order')
const User = require('../models/user')
const wrap = require('../lib/async-wrapper')
const crypto = require('crypto');
const Store = require('../models/store')


module.exports = function(app) {
    app.get("/order", wrap(async(req, res, next) => {
        if (req.query.search_query) {
            var findName = await User.find({ name: req.query.search_query })
            var findPhone = await User.find({ phone: req.query.search_query })
            var findData = await Order.find({ code: req.query.search_query }).populate('user')
            if (findName.length !== 0) {
                var arr = []
                for (i = 0; i < findName.length; i++) {
                    var findData = await Order.find({ user: findName[i]._id }).populate('user').sort('date')
                    arr.push(findData)
                }
                res.render('../views/order.html', { orders: arr[0], title: "訂單管理" })
            } else if (findPhone.length !== 0) {
                var arr = []
                for (i = 0; i < findPhone.length; i++) {
                    var findData = await Order.find({ user: findPhone[i]._id }).populate('user').sort('date')
                    arr.push(findData)
                }
                res.render('../views/order.html', { orders: arr[0], title: "訂單管理" })
            } else if (findData.length !== 0) {
                res.render('../views/order.html', { orders: findData, title: "訂單管理" })
            } else if (findData.length == 0 && findName.length == 0) {
                req.flash('info', '查無資料')
                res.redirect('/order')
            }
        } else {
            let orderList = await Order.find({ date: { $gte: new Date().setHours(0, 0, 0, 0) } }).populate('user').sort('date')
            res.render('../views/order.html', {
                orders: orderList,
                infoMessages: req.flash('info'),
                title: "訂單管理"
            })
        }
    }))

    app.post('/order', wrap(async(req, res, next) => {
        let randomString = crypto.randomBytes(32).toString('base64').substr(0, 6);
        let data = req.body;
        Order.create({
            date: data.date,
            startAt: data.startAt,
            endAt: data.endAt,
            phone: data.phone,
            user: data.user,
            note: data.note,
            code: randomString,
            cancel: data.cancel,
            store: data.store
        });
        console.log('add new Order');
        res.send('預約成功')
    }))

    app.get('/order/date', wrap(async(req, res, next) => {
        let storeList = await Store.find({})
        res.render('../views/date.html', { title: "按日期查詢", storeList: storeList, infoMessages: req.flash('info'), })
    }))

    app.post('/orderbydate', wrap(async(req, res, next) => {
        if (req.body.date != "" && req.body.store == 0) { //日期查詢
            let start = new Date(req.body.date)
            start.setHours(0, 0, 0, 0)
            let end = new Date(req.body.date)
            end.setHours(23, 59, 59, 999)
            let dateFind = await Order.find({ date: { $lte: end, $gte: start } }).populate('user');
            if (dateFind.length == 0) {
                req.flash('info', '查無資料')
                res.redirect('/order')
            } else {
                res.render('../views/order.html', {
                    orders: dateFind,
                    title: "訂單管理",
                    date: new Date(req.body.date).getFullYear() + "/" + (new Date(req.body.date).getMonth() + 1) + "/" + new Date(req.body.date).getDate()
                })
            }
        } else if (req.body.date == "" && req.body.store != 0) { //門市查詢
            let storeId = await Store.find({ name: req.body.store })
            let storeFind = await Order.find({ store: storeId[0]._id }).populate('user')
            if (storeFind.length == 0) {
                req.flash('info', '查無資料')
                res.redirect('/order')
            } else {
                res.render('../views/order.html', {
                    orders: storeFind,
                    store: req.body.store,
                    title: "訂單管理"
                })
            }
        } else if (req.body.date != "" && req.body.store != 0) {
            let start = new Date(req.body.date)
            start.setHours(0, 0, 0, 0)
            let end = new Date(req.body.date)
            end.setHours(23, 59, 59, 999)
            var list = []
            var check = []
            let storeId = await Store.findOne({ name: req.body.store })
            let Find = await Order.find({ date: { $lte: end, $gte: start }, store: storeId.id }).populate('user');
            for (i = 0; i <= storeId.endAt - storeId.startAt-storeId.bookingBlock; i += Number(storeId.bookingBlock)) {
                list.push(i)
                var orderList = await Order.find({
                    store: storeId._id,
                    date: { $lte: end, $gte: start },
                    startAt: String(Number(storeId.startAt) + i),
                    endAt: String(Number(storeId.startAt) + i + Number(storeId.bookingBlock)),
                    cancel: false
                });
                check.push(orderList.length)
            }
            res.render('../views/order.html', {
                orders: Find,
                list:list,
                storeLists: storeId,
                title: "訂單管理",
                check:check,
                prompt: req.body.store + new Date(req.body.date).getFullYear() + "/" + (new Date(req.body.date).getMonth() + 1) + "/" + new Date(req.body.date).getDate()
            })
        } else {
            req.flash('info', '請選擇日期或門市')
            res.redirect('/order/date')
        }
    }))

    app.get('/order/details/:id', wrap(async(req, res, next) => {
        let dataDetails = await Order.findOne({ _id: req.params.id }).populate('user').populate('store');
        let thisDate = new Date(dataDetails.date).setHours(0, 0, 0, 0)
        let today = new Date()
        today.setHours(0, 0, 0, 0)
        if (thisDate < today) {
            status = 0 //已完成
        } else {
            if (dataDetails.cancel == false) {
                status = 2 //進行中
            } else { status = 1 } //取消
        }

        res.render('../views/orderdetails.html', {
            title: "訂單明細",
            dataDetail: dataDetails,
            status: status,
            infoMessages: req.flash('info')
        })
    }))

    app.post('/order/delete/:id', wrap(async(req, res, next) => {
        await Order.remove({ _id: req.params.id })
        console.log('Delete success!');
        req.flash('info', '訂單刪除成功')
        res.redirect('/order')
    }))

    app.post('/order/cancel/:id', wrap(async(req, res, next) => {
        await Order.findOneAndUpdate({ _id: req.params.id }, { cancel: true })
        console.log('Cancel success!');
        req.flash('info', '取消預約成功')
        res.redirect('back')
    }))

    app.post("/orderbyfind", wrap(async(req, res, next) => {
        let findData = await Order.find({
            $or: [{ name: req.body.find },
                { phone: req.body.find },
                { code: req.body.find }
            ]
        })
        if (findData.length == 0) {
            req.flash('info', '查無資料')
            res.redirect('/order')
        } else {
            res.render('../views/order.html', { orders: findData, title: "訂單管理" })
        }
    }))

}

// 新增協助預約