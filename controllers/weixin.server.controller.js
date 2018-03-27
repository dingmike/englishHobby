let jwt = require("jsonwebtoken");
let bcrypt = require('bcrypt-nodejs');
let moment = require('moment');
let async = require('async');
let mongoose = require('mongoose');
let User = mongoose.model('users');
let requestIp = require('request-ip');
let SECRET_TOKEN = "GUSTA_O0000";

// wechat auth
const turingRobot = require('../app/libs/turingRobot');
const autoReply = require('../app/libs/wxAutoReply');
// const wxAuth = require('../libs/wxAuth');

exports.weixin = function (req, res, next) {
    console.log(req.body);
    console.log('weixin Req:' + req.body.xml.content);
    //设置返回数据header

    console.log( 'contentTypedddddddddddddddddddddddddddddd:---------'+ res.get('Content-Type'));

    // res.writeHead(200, {'Content-Type': 'application/xml'});
    //关注后回复
    if (req.body.xml.event === 'subscribe') {
        let resMsg = autoReply('text', req.body.xml, '欢迎关注');
        console.log('weixinData: ' + data);
        res.end(resMsg);
    } else {
        console.log("robot msg:" + req.body.xml.content);
        let info = encodeURI(req.body.xml.content);
        turingRobot(req.body.xml).then(function (data) {
            let response = JSON.parse(data);
            console.log('respenseText:' + response.text);
            let resMsg = autoReply('text', req.body.xml, response.text);
            console.log('weixinData33dddddd: ' + resMsg);
            console.log('send successfull!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
            res.end(resMsg);
            // next();
        })
    }

/*   console.log('new wechat : '+ req.weixin)
    // 微信输入信息都在req.weixin上
    var message = req.weixin;
    if (message.FromUserName === 'diaosi') {
        // 回复屌丝(普通回复)
        res.reply('hehe');
    } else if (message.FromUserName === 'text') {
        //你也可以这样回复text类型的信息
        res.reply({
            content: 'text object',
            type: 'text'
        });
    } else if (message.FromUserName === 'hehe') {
        // 回复一段音乐
        res.reply({
            type: "music",
            content: {
                title: "来段音乐吧",
                description: "一无所有",
                musicUrl: "http://mp3.com/xx.mp3",
                hqMusicUrl: "http://mp3.com/xx.mp3",
                thumbMediaId: "thisThumbMediaId"
            }
        });
    } else {
        // 回复高富帅(图文回复)
        res.reply([
            {
                title: '你来我家接我吧',
                description: '这是女神与高富帅之间的对话',
                picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
                url: 'http://nodeapi.cloudfoundry.com/'
            }
        ]);
    }*/
};

