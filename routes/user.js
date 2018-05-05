const User = require('../models/user')
const Order = require('../models/order')
const wrap = require('../lib/async-wrapper')

module.exports = function(app) {

    app.get("/user/:id/order", wrap(async(req, res, next) => {
        let orderList = await Order.find({ user:req.params.id })
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

}