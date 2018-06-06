const express = require('express');
const linebot = require('linebot');
const User = require('../../models/user');

var bot = linebot({
    channelId: '1584780131',
    channelSecret: 'c9efb2ffebcb13edad9989e6057f7467',
    channelAccessToken: 'Li0ua8fkIwKgTdFfSkij2O1R7f6rnOg9dk7pjzDx1nDddBkIcIKC8uSsfVHtxI3uXB+2+QWDGA2XssRa2AZOCfdCghqzo4TYpD1hF+tP2bZemS4f1LOHbShHQrKruK6jxhaXz0SzBKg2RlrcAdPlDgdB04t89/1O/w1cDnyilFU='
});

let router = express.Router()
const linebotParser = bot.parser()

bot.on('follow', function(event) {
    event.reply('您好,請輸入您的名字');
});


bot.on('message', async function(event) {
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
            event.reply('http://968c7c95.ngrok.io/#/myorder/' + user[0]._id).then(function() {
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
            event.reply('http://968c7c95.ngrok.io/#/calendar/' + user[0]._id).then(function() {
                console.log('success reply')
            })
        }
    }


});

router.post('/webhook', linebotParser);

module.exports = router