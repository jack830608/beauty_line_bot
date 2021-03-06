const User = require('../models/user')
const Order = require('../models/order')
const Store = require('../models/store')
const Closed = require('../models/closed')
const Init = require('../models/init')
const wrap = require('../lib/async-wrapper')
const crypto = require('crypto');

module.exports = function(app) {

    app.get("/user/:id/order", wrap(async(req, res, next) => {
        let orderList = await Order.find({ user: req.params.id }).populate("store")
        res.send(orderList);
    }))

    app.get("/admin/order", wrap(async(req, res, next) => {
        let orderList = await Order.find({}).populate("store")
        res.send(orderList);
    }))

    app.get("/user/:id/myorder", wrap(async(req, res, next) => {
        let prvMonth = new Date().getFullYear() + "/" + (new Date().getMonth()) + "/" + new Date().getDate()
        let start = new Date(prvMonth)
        start.setHours(0, 0, 0, 0)
        let orderList = await Order.find({ user: req.params.id, date: { $gt: start } }).populate("store").sort({ date: 1, startAt: 1 })
        res.send(orderList);
    }))

    app.post("/user", wrap(async(req, res, next) => {
        await User.create({
            name: req.body.name,
            phone: req.body.phone,
            lineId: req.body.lineId
        });
        console.log("user create success")
    }))

    app.get("/user/:date/booking", wrap(async(req, res, next) => {
        let store = await Store.find();
        var list = []
        var check = []
        var storeList = await Store.find({ name: store[0].name });
        var start = new Date(req.params.date)
        start.setHours(0, 0, 0, 0)
        var end = new Date(req.params.date)
        end.setHours(23, 59, 59, 999)
        let order = await Order.find({ date: { $lte: end, $gte: start }, store: storeList[0]._id }).populate('user').sort({ startAt: -1 });
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

    app.post("/booking/:store/:date", wrap(async(req, res, next) => {
        var list = []
        var check = []
        var storeList = await Store.find({ name: req.params.store });
        var start = new Date(req.params.date)
        start.setHours(0, 0, 0, 0)
        var end = new Date(req.params.date)
        end.setHours(23, 59, 59, 999)
        var orders = await Order.find({ date: { $lte: end, $gte: start }, store: storeList[0]._id }).populate('user').sort({ startAt: 1 })
        for (i = 0; i < storeList[0].endAt - storeList[0].startAt; i += Number(storeList[0].bookingBlock)) {
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
        res.send([storeList, list, check, orders])

    }))

    app.post("/booking/:userId/:date/:startTime/:endTime/:store/:note", wrap(async(req, res, next) => {
        var storeList = await Store.findOne({ name: req.params.store });
        var randomString = crypto.randomBytes(64).toString('hex').substr(0, 5);
        var init = await Init.findOne({});
        var closed = await Closed.find({});
        var closeDateByMonth = init.closeDateByMonth.split(',').map(function(item) {
            return parseInt(item, 10); //將Srting轉成Array
        });
        var closedList = [];
        for (var i = 0; i < closed.length; i++) {
            closedList.push((new Date(closed[i].date).getFullYear() + '/' + new Date(closed[i].date).getMonth() + '/' + new Date(closed[i].date).getDate()))
        }
        var orders = await Order.find({
            date: req.params.date,
            store: storeList._id,
            startAt: req.params.startTime,
            endAt: req.params.endTime,
            cancel: false
        });
        // if (req.params.startTime < 10) req.params.startTime = '0' + req.params.startTime
        // if (Number(req.params.end) < 10) req.params.startTime = '0' + req.params.end

        if (orders.length >= storeList.sameTimeBook) { //預約人數已滿
            res.send("Error")
        } else if (new Date(req.params.date).getDay() == init.closeDateByWeek) { //每週固定休假
            res.send("Error")
        } else if (closeDateByMonth.indexOf(req.params.date) >= 0) { //每月固定休假
            res.send("Error")
        } else if (closedList.indexOf((new Date(req.params.date).getFullYear() + '/' + new Date(req.params.date).getMonth() + '/' + new Date(req.params.date).getDate())) >= 0) {
            //特殊休假
            res.send("Error")
        } else {
            var bookingOrder = await Order.create({
                date: req.params.date,
                startAt: req.params.startTime,
                endAt: req.params.endTime,
                user: req.params.userId,
                note: req.params.note,
                code: randomString,
                store: storeList._id
            });
            console.log('add new Order');
            res.send(bookingOrder._id)
        }
    }))

    app.get("/booking/:userOrder/order", wrap(async(req, res, next) => {
        let orderList = await Order.findOne({ _id: req.params.userOrder }).populate('store')
        res.send(orderList);
    }))


    app.post('/cancel/:orderId', wrap(async(req, res, next) => {
        var orderId = req.params.orderId
        await Order.findOneAndUpdate({ _id: orderId }, { cancel: true })
        console.log('Delete success!');
        res.send('delete')
    }))

}