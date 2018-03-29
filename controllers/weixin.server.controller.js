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
const translateRobot = require('../app/libs/translateRobot');
// const translateObj = require('translate-api');
// const translate = require('google-translate-api');

const autoReply = require('../app/libs/wxAutoReply');
const wxAuth = require('../app/libs/wxAuth');

exports.weixin = function (req, res, next) {
    console.log(req.body);
    console.log('weixin Req:' + req.body.xml.content);
    //设置返回数据header
    console.log( 'contentTypedddddddddddddddddddddddddddddd:---------'+ res.get('Content-Type'));
    // res.writeHead(200, {'Content-Type': 'application/xml'});
    //关注后回复, wechat server request
    let message = req.body.xml;
   /* if (message.event === 'subscribe') {
        let resMsg = autoReply('text', req.body.xml, '欢迎关注');
        console.log('weixinData: ' + data);
        res.end(resMsg);
    } else {
        console.log("robot msg:" + req.body.xml.content);
        let info = encodeURI(req.body.xml.content);


      /!*  turingRobot(req.body.xml).then(function (data) {
            let response = JSON.parse(data);
            console.log('respenseText:' + response.text);
            let resMsg = autoReply('text', req.body.xml, response.text);
            console.log('weixinData33dddddd: ' + resMsg);
            console.log('send successfull!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
            res.end(resMsg);

            // next();
        },function (err) {
            console.log('INNER ERROR: ' + err)
        })*!/



    }*/

    console.log(message);
    if(message.msgtype === 'event'){
        let resContent ='';
        if(message.event === 'subscribe'){
            if(message.EventKey) {
                console.log('扫描二维码关注：'+ message.EventKey +' '+ message.ticket);
            }
            resContent = '终于等到你，还好我没放弃';
        }else if(message.event === 'unsubscribe'){
            resContent = '';
            console.log(message.FromUserName + ' 悄悄地走了...');
        }else if(message.event === 'LOCATION'){
            resContent = '您上报的地理位置是：latitude:'+ message.latitude + ',longitude:' + message.longitude +',precision:' + message.precision;
        }else if(message.event === 'CLICK'){
            resContent = '您点击了菜单：'+ message.eventKey;
        }else if(message.event === 'SCAN'){
            resContent = '关注后扫描二维码：'+ message.ticket;
        }
        let resMsg = autoReply('text', req.body.xml, resContent);
        console.log('weixinData33dddddd: ' + resMsg);
        console.log('send successfull !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        res.end(resMsg);
    } else if(message.msgtype === 'text'){
        translateRobot(message).then(function(data){
            // let response = JSON.parse(data);
            console.log('respenseText:' + data);
            let resMsg = autoReply('text', req.body.xml, data);
            console.log('weixinData33dddddd: ' + resMsg);
            console.log('send successfull !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
            res.end(resMsg);
            // next();
        }, function (err) {
            console.log('INNER ERROR: ' + err)
        })
    }
};





