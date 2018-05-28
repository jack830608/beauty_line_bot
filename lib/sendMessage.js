const cronJob = require("cron").CronJob;
const axios = require('axios');
const Order = require('../models/order')
const wrap = require('../lib/async-wrapper')


var sendMessage = new cronJob('0 0 20 * * *', async function() {
    let start = new Date()
    start.setDate(start.getDate() + 1)
    start.setHours(0, 0, 0, 0)
    let end = new Date()
    end.setDate(end.getDate() + 1)
    end.setHours(23, 59, 59, 999)
    var order = await Order.find({ date: { $lte: end, $gte: start }, cancel: false }).populate('user');
    if (order.length > 0) {
        for (i = 0; i < order.length; i++) {
            var phone = order[i].user.phone
            var message = order[i].user.name + " 您好, 提醒您, 您有預約 " + order[i].date.getFullYear() + '/' + (order[i].date.getMonth() + 1) + '/' + order[i].date.getDate() + ' 的服務'
            // axios.get('http://ep5api.ite2.com.tw/fpSend.aspx?to=' + phone + '&text=' + encodeURIComponent(message) + '&user=cydsgn&pass=cydsgn168')
            //     .then(function() {
            //         console.log("send message success");
            //     })
            //     .catch(function(err) {
            //         console.log(err);
            //     })
        }
    }

}, null, true, 'Asia/Chongqing');

module.exports = sendMessage