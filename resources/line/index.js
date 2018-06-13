const express = require('express');
const linebot = require('linebot');
const User = require('../../models/user');

var bot = linebot({
    channelId: '1584780131',
    channelSecret: 'c9efb2ffebcb13edad9989e6057f7467',
    channelAccessToken: 'Li0ua8fkIwKgTdFfSkij2O1R7f6rnOg9dk7pjzDx1nDddBkIcIKC8uSsfVHtxI3uXB+2+QWDGA2XssRa2AZOCfdCghqzo4TYpD1hF+tP2bZemS4f1LOHbShHQrKruK6jxhaXz0SzBKg2RlrcAdPlDgdB04t89/1O/w1cDnyilFU='
});

const router = express.Router()
const linebotParser = bot.parser()
router.post('/webhook', linebotParser)
// router.post('/webhook', function(res, req) {
//     res.send('line')
// })

bot.on('follow', function(event) {
    event.reply('您好,請輸入您的名字');
});


bot.on('message', async function(event) {
    var URL = 'http://128.199.249.93'
    let lengthIs10 = String(event.message.text).length
    let onlyNumber = /^\d+$/.test(event.message.text)
    let lineId = event.source.userId
    let user = await User.find({ lineId: lineId })
    let findPhone = await User.find({ lineId: lineId, phone: { $exists: true } })
    let phone = await User.find({ phone: event.message.text })
    if (user.length == 0 && (event.message.text != '我的訂單' && event.message.text != '預約')) {
        await User.create({
            lineId: lineId,
            name: event.message.text
        });
        console.log('create user name success ')
        event.reply('請輸入您的手機號碼').then(function() {
            console.log('success reply')
        })
    } else if (user.length != 0 && (lengthIs10 == 10) && onlyNumber) {
        await User.findOneAndUpdate({ lineId: lineId }, { phone: event.message.text })
        event.reply('使用者建立成功,可以開始預約了！').then(function() {
            console.log('create user success')
        })
    } else if (event.message.text == '我的訂單') {
        if (user.length == 0) {
            event.reply('請輸入您的名字').then(function() {
                console.log('success reply')
            })
        } else if (findPhone.length == 0) {
            event.reply('請輸入您的手機號碼').then(function() {
                console.log('success reply')
            })
        } else {
            event.reply(URL + '/#/myorder/' + user[0]._id).then(function() {
                console.log('success reply')
            })
        }
    } else if (event.message.text == '預約') {
        if (user.length == 0) {
            event.reply('請輸入您的名字').then(function() {
                console.log('success reply')
            })
        } else if (findPhone.length == 0) {
            event.reply('請輸入您的手機號碼').then(function() {
                console.log('success reply')
            })
        } else {
            event.reply(URL + '/#/calendar/' + user[0]._id).then(function() {
                console.log('success reply')
            })
        }
    } else if (event.message.text == "修改個人資料") {
        event.reply('若要修改使用者名稱或手機號碼請在新的名稱或電話前加上“#”                                   範例:                                   王大明 ->王小明 0912345678 -> 0987654321                        修改名稱:    #王小明            修改電話:    #0987654321').then(function() {
            console.log('success reply')
        })
    } else if (event.message.text.indexOf("#") >= 0) {
        let data = event.message.text.slice(1)
        let lengthIs10 = String(data).length
        let onlyNumber = /^\d+$/.test(data)
        if ((lengthIs10 == 10) && onlyNumber) {
            await User.findOneAndUpdate({ lineId: lineId }, { phone: data })
            event.reply('手機號碼修改成功！').then(function() {
                console.log('modify user phone success')
            })
        } else {
            await User.findOneAndUpdate({ lineId: lineId }, { name: data })
            event.reply('使用者名稱修改成功！').then(function() {
                console.log('modify user name success')
            })

        }
    }


});



module.exports = router