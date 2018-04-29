const Order = require('../models/order')
const wrap = require('../lib/async-wrapper')

module.exports = function(app) {
    app.get("/order", wrap(async(req, res, next) => {
        let orderList = await Order.find({})
        res.render('../views/order.html', {
            orders: orderList,
            infoMessages: req.flash('info'),
            title: "訂單管理"
        })
    }))

    app.post('/order', wrap(async(req, res, next) => {
        let orderList = await Order.findOne({
            date: req.body.date,
            tartAt: req.body.startAt,
            endAt: req.body.endtAt
        })
        // if (orderList) {
        //     res.send('此時段有人預約')
        // } else {
        Order.create({
            date: data.date,
            startAt: data.startAt,
            endAt: data.endAt,
            phone: data.phone,
            name: data.name,
            note: data.note,
            code: data.code,
            cancel: data.cancel
        });
        console.log('add new Order');
        res.send('預約成功')
    }))

    app.get('/order/date', wrap(async(req, res, next) => {
        res.render('../views/date.html', { title: "按日期查詢" })
    }))

    app.post('/orderbydate', wrap(async(req, res, next) => {
        let dateFind = await Order.find({ date: req.body.date });
        if (dateFind.length == 0) {
            req.flash('info', '查無資料')
            res.redirect('/order')
        } else {
            res.render('../views/order.html', { orders: dateFind })
        }
    }))

    app.get('/order/details/:id', wrap(async(req, res, next) => {
        let dataDetails = await Order.findOne({ _id: req.params.id });
        if (dataDetails.cancel == false) {
            status = "進行中"
        } else { status = "取消" }
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
        let orderList = await Order.findOne({ _id: req.params.id })
        let oldstatus = { cancel: orderList.cancel }
        await Order.update(oldstatus, { cancel: true })
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
            res.render('../views/order.html', { orders: findData })
        }
    }))
}