const Order = require('../models/order')
const User = require('../models/user')
const wrap = require('../lib/async-wrapper')
const crypto = require('crypto');
const Store = require('../models/store')


module.exports = function(app) {
    app.get("/order", wrap(async(req, res, next) => {
        if (req.session.admin) {
            // if (req.query.search_query) {
            //     var findName = await User.find({ name: req.query.search_query })
            //     var findPhone = await User.find({ phone: req.query.search_query })
            //     var findData = await Order.find({ code: req.query.search_query }).populate('user')
            //     if (findName.length !== 0) {
            //         var arr = []
            //         for (i = 0; i < findName.length; i++) {
            //             var findData = await Order.find({ user: findName[i]._id }).populate('user').sort('date')
            //             arr.push(findData)
            //         }
            //         res.render('../views/order.html', { orders: arr[0], title: "訂單管理" })
            //     } else if (findPhone.length !== 0) {
            //         var arr = []
            //         for (i = 0; i < findPhone.length; i++) {
            //             var findData = await Order.find({ user: findPhone[i]._id }).populate('user').sort('date')
            //             arr.push(findData)
            //         }
            //         res.render('../views/order.html', { orders: arr[0], title: "訂單管理" })
            //     } else if (findData.length !== 0) {
            //         res.render('../views/order.html', { orders: findData, title: "訂單管理" })
            //     } else if (findData.length == 0 && findName.length == 0) {
            //         req.flash('info', '查無資料')
            //         res.redirect('/order')
            //     }
            // } else {
            let orderList = await Order.find({ date: { $gte: new Date().setHours(0, 0, 0, 0) } }).populate('user').sort('date')
            res.render('../views/order.html', {
                // orders: orderList,
                // infoMessages: req.flash('info'),
                title: "訂單管理"
            })
            // }
        } else {
            req.flash('err', '請先登錄')
            res.redirect('/admin/signin')
        }
    }))

    app.post('/order', wrap(async(req, res, next) => {
        let randomString = crypto.randomBytes(64).toString('hex').substr(0, 5);
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
        } else if (req.body.date != "" && req.body.store != 0) { // 門市+日期
            let start = new Date(req.body.date)
            start.setHours(0, 0, 0, 0)
            let end = new Date(req.body.date)
            end.setHours(23, 59, 59, 999)
            var list = []
            var check = []
            let storeId = await Store.findOne({ name: req.body.store })
            let Find = await Order.find({ date: { $lte: end, $gte: start }, store: storeId.id }).populate('user');
            for (i = 0; i <= storeId.endAt - storeId.startAt - storeId.bookingBlock; i += Number(storeId.bookingBlock)) {
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
                list: list,
                storeLists: storeId,
                title: "訂單管理",
                check: check,
                prompt: new Date(req.body.date).getFullYear() + "/" + (new Date(req.body.date).getMonth() + 1) + "/" + new Date(req.body.date).getDate() + " " + req.body.store
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
        var orders = await Order.findOne({ _id: req.params.id })
        var date = new Date(orders.date).getFullYear() + "-" + (new Date(orders.date).getMonth() + 1) + "-" + new Date(orders.date).getDate()
        await Order.remove({ _id: req.params.id })

        console.log(date)
        console.log('Delete success!');
        // req.flash('info', '訂單刪除成功')
        res.redirect('/#/admin/booking/' + date)
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

    app.get("/order/:date/booking", wrap(async(req, res, next) => {
        let store = await Store.find();
        var list = []
        var check = []
        var storeList = await Store.find({ name: store[0].name });
        var start = new Date(req.params.date)
        start.setHours(0, 0, 0, 0)
        var end = new Date(req.params.date)
        end.setHours(23, 59, 59, 999)
        let order = await Order.find({ date: { $lte: end, $gte: start }, store: storeList[0]._id }).populate('user').sort({startAt:1});
        for (i = 0; i <= storeList[0].endAt - storeList[0].startAt - storeList[0].bookingBlock; i += Number(storeList[0].bookingBlock)) {
            list.push(i)
            var orderList = await Order.find({
                store: storeList[0]._id,
                date: { $lte: end, $gte: start },
                startAt: String(Number(storeList[0].startAt) + i),
                endAt: String(Number(storeList[0].startAt) + i + Number(storeList[0].bookingBlock)),
                cancel: false
            });
            check.push(orderList.length)

        }
        res.send([store, storeList, list, check, order])
    }))

    app.post("/order/search/:store/:text/:date", wrap(async(req, res, next) => {
        let store = req.params.store
        let text = req.params.text
        let date = req.params.date
        let start = new Date(date)
        start.setHours(0, 0, 0, 0)
        let end = new Date(date)
        end.setHours(23, 59, 59, 999)
        var findStore = await Store.findOne({ name: store })
        var findName = await User.find({ name: text })
        var findPhone = await User.find({ phone: text })
        var findData = await Order.find({ code: text, store: findStore._id, date: { $lte: end, $gte: start } }).populate('user')
        if (findName.length != 0) {
            var arr = []
            for (i = 0; i < findName.length; i++) {
                var findData = await Order.find({ user: findName[i]._id, store: findStore._id, date: { $lte: end, $gte: start } }).populate('user').sort('startAt')
                arr.push(findData)
            }
            if (findData.length != 0) { res.send(findData) } else { res.send('error') }

        } else if (findPhone.length != 0) {
            var arr = []
            for (i = 0; i < findPhone.length; i++) {
                var findData = await Order.find({ user: findPhone[i]._id, store: findStore._id, date: { $lte: end, $gte: start } }).populate('user').sort('startAt')
                arr.push(findData)
            }
            if (findData.length != 0) { res.send(findData) } else { res.send('error') }
        } else if (findData.length != 0) {
            res.send(findData)
        } else {
            res.send('error')
        }

    }))

}

// 新增協助預約