const User = require('../models/user')
const Order = require('../models/order')
const Store = require('../models/store')
const wrap = require('../lib/async-wrapper')

module.exports = function(app) {

    app.get("/user/:id/order", wrap(async(req, res, next) => {
        let orderList = await Order.find({ user: req.params.id })
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

    app.get("/user/:id/booking", wrap(async(req, res, next) => {
        let storeList = await Store.find();
        res.send(storeList);
    }))

    app.post("/booking/:store/:date", wrap(async(req, res, next) => {
        var list = []
        var check = []
        var storeList = await Store.find({ name: req.params.store });
        var start = new Date(req.params.date)
        start.setHours(0, 0, 0, 0)
        var end = new Date(req.params.date)
        end.setHours(23, 59, 59, 999)
        for (i = 0; i < storeList[0].endAt - storeList[0].startAt; i += Number(storeList[0].bookingBlock)) {
            list.push(i)
            var orderList = await Order.find({
                store: storeList[0]._id,
                date: { $lte: end, $gte: start },
                startAt: String(Number(storeList[0].startAt) + i),
                endAt: String(Number(storeList[0].startAt) + i + Number(storeList[0].bookingBlock))
            });
            check.push(orderList.length)

        }
        res.send([storeList, list, check])

    }))


}