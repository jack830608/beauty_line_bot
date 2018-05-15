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
        let start = new Date(req.params.id)
        start.setHours(0, 0, 0, 0)
        let end = new Date(req.params.id)
        end.setHours(23, 59, 59, 999)
        let orderList = await Order.find({ date: { $lte: end, $gte: start } });
        let storeList = await Store.find();
        res.send([orderList, storeList]);
    }))


    app.post("/booking/:id", wrap(async(req, res, next) => {

        let storeList = await Store.find({ name: req.params.id });
        res.send(storeList)

    }))


}