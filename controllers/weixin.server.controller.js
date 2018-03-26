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


exports.weixin = function (req, res) {
    //设置返回数据header
    res.writeHead(200, {'Content-Type': 'application/xml'});
    //关注后回复
    if (req.body.xml.event === 'subscribe') {
        var resMsg = autoReply('text', req.body.xml, '欢迎关注');
        res.end(resMsg);
    } else {
        var info = encodeURI(req.body.xml.content);
        turingRobot(info).then(function (data) {
            var response = JSON.parse(data);
            var resMsg = autoReply('text', req.body.xml, response.text);
            console.log('weixinData: ' + data);
            res.end(resMsg);
        })
    }
};

