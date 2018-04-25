var Order = require('../models/order')

module.exports = function(app) {
    app.get("/order",function(req,res){
        res.render('../views/order.html')
    })

    app.post('/order', function(req, res) {
        var data = req.body
        console.log(data)
        Order.findOne({ date: data.date, tartAt: data.startAt, endAt: data.endtAt },
            function(err, c) {
                console.log(c);
                if (c) {
                    res.send('此時段有人預約')
                } else {
                    Order.create({
                        date: data.date,
                        startAt: data.startAt,
                        endAt: data.endtAt,
                        phone: data.phone,
                        name: data.name,
                        note: data.note,
                        code: data.code
                    });
                    console.log('add new Order');
                    res.send('預約成功')
                }
            })

    })
    app.delete('/order/delete', function(req, res) {

    })

    app.put('/order/update', function(req, res) {

    })
}