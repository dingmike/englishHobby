let jwt = require("jsonwebtoken");
let bcrypt = require('bcrypt-nodejs');
let moment = require('moment');
let async = require('async');
let fs = require('fs');

let requestIp = require('request-ip');
let SECRET_TOKEN = "GUSTA_O0000";
const config = require('../config');
const request = require('request');

// wechat auth
const turingRobot = require('../app/libs/turingRobot');
const translateRobot = require('../app/libs/translateRobot');
const getUserOpenid = require('../app/libs/wxGetUserOpenid');
// const translateObj = require('translate-api');
// const translate = require('google-translate-api');

const autoReply = require('../app/libs/wxAutoReply');
const wxAuth = require('../app/libs/wxAuth');


// data model
let mongoose = require('mongoose');
let User = mongoose.model('users');


exports.weixin = function (req, res, next) {
    console.log(req.body);
    console.log('weixin Req:' + req.body.xml.content);
    //设置返回数据header
    console.log('contentTypedddddddddddddddddddddddddddddd:---------' + res.get('Content-Type'));
    // res.writeHead(200, {'Content-Type': 'application/xml'});
    //关注后回复, wechat server request
    let message = req.body.xml;

    console.log(message);
    if (message.msgtype === 'event') {
        let resContent = '';
        if (message.event === 'subscribe') {
            if (message.EventKey) {
                console.log('扫描二维码关注：' + message.EventKey + ' ' + message.ticket);
            }
            resContent = '终于等到你，还好我没放弃, 回复：以‘翻译’二字开头的中文，可以翻译英文；当然您还可以和我用英文对话！';
        } else if (message.event === 'unsubscribe') {
            resContent = '';
            console.log(message.FromUserName + ' 悄悄地走了...');
        } else if (message.event === 'LOCATION') {
            resContent = '来至newscnn的问候，Your location is：latitude:' + message.latitude + ',longitude:' + message.longitude + ',precision:' + message.precision;
        } else if (message.event === 'CLICK') {
            resContent = '您点击了菜单：' + message.eventKey;
        } else if (message.event === 'SCAN') {
            resContent = '关注后扫描二维码：' + message.ticket;
        }
        let resMsg = autoReply('text', req.body.xml, resContent);
        console.log('weixinData33dddddd: ' + resMsg);
        console.log('send successfull !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        res.end(resMsg);
    } else if (message.msgtype === 'text') {
        translateRobot(message).then(function (data) {
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


// 微信一键登录系统
exports.wxLogin = function (req, res, next) {
    console.log(req.body);
    console.log('wxcode' + req.body.code);
    saveCode(req.body.code);
    // request the wechat api
    let wxUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + config.wechatNewConf.appid + '&secret=' + config.wechatNewConf.appSecret + '&code=' + req.body.code + '&grant_type=authorization_code';
    getUserOpenid(wxUrl).then(function (data) {
        console.log('last:' + data)
        //因为微信code五分钟内不能重复获取，需要保存起来

        let openid = data.openid,
            access_token = data.access_token,
            refresh_token = data.refresh_token,
            scope = data.scope;

        //1、通过静默获取用户openid
        // 通过openid查询是否已通过微信授权认证，没有认证就保存openid和access_token,refresh_token
        User.findOne({openid: openid}, function (err, user) {
            if (err) {
                res.status(500).send('internal_server_error');
            } else {
                if (user) {
                    console.log("USers:  "+user);
                        res.send({
                            code:200,
                            type: true,
                            data: user
                        });
                } else {
                    // res.status(500).send('user_not_found');
                    // 保存用户openid
                    let newUser = new User({
                        openid: openid,
                    });
                    newUser.save();
                }
            }
        });


    }, function (err) {
        console.log('err:' + err)
    });






    // 保存code
    function saveCode(code) {
        fs.writeFile('./code', code, function (err) {
            console.log('Save code successful!')
        });
    }
    // 保存refresh_token

    function refreshToken() {

        setInterval(function () {
            saveToken();
        }, 7000 * 1000);
    }


};





