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
    console.log('weixinReq:' + req.body.xml.content);
    //设置返回数据header

    console.log( 'contentTypedddddddddddddddddddddddddddddd:---------'+ res.get('Content-Type'));

    // res.writeHead(200, {'Content-Type': 'application/xml'});
    //关注后回复
    if (req.body.xml.event === 'subscribe') {
        let resMsg = autoReply('text', req.body.xml, '欢迎关注');
        console.log('weixinData: ' + data);
       // res.end(resMsg);
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
        })
    }

    // next();
};

