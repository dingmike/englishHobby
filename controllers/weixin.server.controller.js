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

// 微信一键登录
exports.wxLogin = function (req, res, next) {
    // res.setHeader('Content-Type', 'text/html');
    // 用户端触授权登录
    // const HOST = 'http://newscnn.yiqigo.top/';
    let redirect_router = 'wechat/getWxAccess_token';
    let redirect_link = encodeURI('http://newscnn.yiqigo.top/' + redirect_router);
    let scopeInfo = 'snsapi_userinfo'; //snsapi_userinfo :获取用户基本信息，snsapi_base：用户openid
    let wxAlink = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + config.wechatNewConf.appid + '&redirect_uri=' + redirect_link + '&response_type=code&scope=' + scopeInfo + '&state=123#wechat_redirect"';
    res.redirect(wxAlink);
};

exports.getWxAccess_token = function (req, res, next) {
    // console.log("get_wx_access_token");
    // console.log("code_return: "+req.query.code);
    // 第二步：通过code换取网页授权access_token
    let code = req.query.code;
    request.get(
        {
            url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + config.wechatNewConf.appid + '&secret=' + config.wechatNewConf.appSecret + '&code=' + code + '&grant_type=authorization_code',
        },
        function (error, response, body) {
            if (response.statusCode == 200) {
                // 第三步：拉取用户信息(需scope为 snsapi_userinfo)
                //console.log(JSON.parse(body));
                let data = JSON.parse(body);
                let access_token = data.access_token;
                let openid = data.openid;
                request.get(
                    {
                        url: 'https://api.weixin.qq.com/sns/userinfo?access_token=' + access_token + '&openid=' + openid + '&lang=zh_CN',
                    },
                    function (error, response, body) {
                        if (response.statusCode == 200) {
                            // 第四步：根据获取的用户信息进行对应操作
                            let userinfo = JSON.parse(body);
                            //console.log(JSON.parse(body));
                            console.log('获取微信信息成功！');

                            // 如果没有该用户，则创建一个新帐户
                            User.findOne({unionid: userinfo.unionid}, {
                                _id: true,
                                nickname: true,
                                headimgurl: true,
                                userCountry: true,
                                userProvince: true,
                                userCity: true,
                                createdAt: true,
                                roles: true,
                                sex: true,
                                age: true,
                                phone: true,
                                score: true,
                                money: true,
                                realAddress: true,
                                realName: true,
                                email: true,
                                readPages: true,
                                isAnswerToday: true,
                                enableScore: true,

                            }, function (err, user) {
                                if (err) {
                                    res.status(500).send('internal_server_error');
                                } else {
                                    // 已存在此用户直接登录成功返回用户信息
                                    if (user) {
                                        res.send({
                                            code: 200,
                                            data: user,
                                            msg:'获取用户信息成功！'
                                        });
                                    } else {
                                        // res.status(500).send('user_not_found');
                                        // 保存用户openid
                                        let newUser = new User({
                                            unionid: userinfo.unionid,
                                            openid: userinfo.openid,
                                            nickname: userinfo.nickname,
                                            headimgurl: userinfo.headimgurl,
                                            userCountry: userinfo.userCountry,
                                            userProvince: userinfo.userProvince,
                                            userCity: userinfo.userCity,
                                            sex: userinfo.sex,
                                        });
                                        newUser.save(function(err, doc){
                                            if (err) {
                                                res.status(500).send('internal_server_error');
                                            } else{
                                                res.redirect('http://www.baidu.com');
                                                /*res.send({
                                                    code: 200,
                                                    type: true,
                                                    data: {
                                                        _id: doc._id,
                                                        nickname: doc.nickname,
                                                        headimgurl: doc.headimgurl,
                                                        userCountry: doc.userCountry,
                                                        userProvince: doc.userProvince,
                                                        userCity: doc.userCity,
                                                        roles: doc.roles,
                                                        sex: doc.sex,
                                                        phone: doc.phone,
                                                        score: doc.score,
                                                        money: doc.money,
                                                        age: doc.age,
                                                        realAddress: doc.realAddress,
                                                        realName: doc.realName,
                                                        createdAt: doc.createdAt,
                                                        email: doc.email,
                                                        readPages: doc.readPages,
                                                        isAnswerToday: doc.isAnswerToday,
                                                        enableScore: doc.enableScore
                                                    }
                                                });*/
                                            }

                                        });

                                    }
                                }
                            });

                        } else {
                            console.log(response.statusCode);
                            res.send({
                                code: response.statusCode,
                                type: true,
                            });
                        }
                    }
                );
            } else {
                console.log(response.statusCode);
                res.send({
                    code: response.statusCode,
                    type: true,
                });
            }
        }
    );
};






