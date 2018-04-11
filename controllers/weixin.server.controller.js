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
    // res.setHeader('Content-Type', 'text/html');
    // 用户端触授权登录
    // const HOST = 'http://newscnn.yiqigo.top/';
    let redirect_router = 'wechat/getWxAccess_token';
    let redirect_link = encodeURI('http://newscnn.yiqigo.top/' + redirect_router);
    let scopeInfo ='snsapi_userinfo'; //snsapi_userinfo :获取用户基本信息，snsapi_base：用户openid
    let wxAlink = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ config.wechatNewConf.appid +'&redirect_uri=' + redirect_link + '&response_type=code&scope='+ scopeInfo +'&state=123#wechat_redirect"';
    console.log('wxAlink: ' + wxAlink);
    res.redirect(wxAlink);

 /*
    request.get(wxAlink, function (err, response, body) {
        if (err) {
            console.log('Wechat api error - wxAlink error: ' + err);
        }else {

            console.log('body code:' +  body);

            fs.writeFile('./public/wechat/redirect_url.html', body, function (err) {
                console.log('Save body successful!');
                res.send('redirect_url.html');
            });

            /!*res.send({
                code:200,
                data: response.body
            })*!/
           // saveCode(req.body.code);

            // request the wechat api
         /!*   let wxUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + config.wechatNewConf.appid + '&secret=' + config.wechatNewConf.appSecret + '&code=' + req.body.code + '&grant_type=authorization_code';
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
            });*!/

        }
    });


*/

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

exports.getWxAccess_token = function (req, res, next) {
    // console.log("get_wx_access_token");
    // console.log("code_return: "+req.query.code);

    // 第二步：通过code换取网页授权access_token
    let code = req.query.code;
    request.get(
        {
            url:'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+ config.wechatNewConf.appid +'&secret='+config.wechatNewConf.appSecret+'&code='+ code +'&grant_type=authorization_code',
        },
        function(error, response, body){
            if(response.statusCode == 200){
                // 第三步：拉取用户信息(需scope为 snsapi_userinfo)
                //console.log(JSON.parse(body));
                let data = JSON.parse(body);
                let access_token = data.access_token;
                let openid = data.openid;
                request.get(
                    {
                        url:'https://api.weixin.qq.com/sns/userinfo?access_token='+access_token+'&openid='+openid+'&lang=zh_CN',
                    },
                    function(error, response, body){
                        if(response.statusCode == 200){
                            // 第四步：根据获取的用户信息进行对应操作
                            let userinfo = JSON.parse(body);
                            //console.log(JSON.parse(body));
                            console.log('获取微信信息成功！');

                            // 小测试，实际应用中，可以由此创建一个帐户

                            User.findOne({unionid: userinfo.unionid}, {nickname: true, headimgurl:true, userCountry: true, userProvince: true, userCity: true, createdTime: true, role: true, sex: true, age: true}, function (err, user) {
                                if (err) {
                                    res.status(500).send('internal_server_error');
                                } else {
                                    // 已存在此用户直接登录成功返回用户信息
                                    if (user) {
                                        res.send({
                                            code:200,
                                            type: true,
                                            data: user
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
                                            role: userinfo.role,
                                            sex: userinfo.sex,
                                        });
                                        newUser.save();
                                        res.send("\
                                <h1>"+userinfo.nickname+" 的个人信息</h1>\
                                <p><img src='"+userinfo.headimgurl+"' /></p>\
                                <p>"+userinfo.city+"，"+userinfo.province+"，"+userinfo.country+"</p>\
                            ");

                                    }
                                }
                            });




                        }else{
                            console.log(response.statusCode);
                        }
                    }
                );
            }else{
                console.log(response.statusCode);
            }
        }
    );
 }






