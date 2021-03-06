let jwt = require("jsonwebtoken");
let bcrypt = require('bcryptjs');
let moment = require('moment');
let async = require('async');
let mongoose = require('mongoose');
let User = mongoose.model('users');
let requestIp = require('request-ip');
let SECRET_TOKEN = "GUSTA_O0000";

// wechat auth
const getJsApiData = require('../app/libs/getJsApiData');
const config = require('../config');



//创建菜单
const createMenu = require('../app/libs/wxCustomeMenu');

createMenu();

exports.auth = function (req, res) {
    let clientUrl = 'http://' + req.hostname + req.url;
    // 获取微信授权认证信息
    getJsApiData(clientUrl).then(data => {
        console.log('auth-data: ' + data);
        console.log(1111111111111111111);
        console.log('signature:'+ data[0],'timestamp: ' + data[1], 'nonceStr: ' + data[2], 'appId: ' +  config.wechatConfig.appId);
        let authData = {signature: data[0], timestamp: data[1], nonceStr: data[2], appId: config.wechatConfig.appId};

        res.send({
            code: 200,
            data: authData
        });
       // res.render('base.html', {signature: data[0], timestamp: data[1], nonceStr: data[2], appId: config.appId});
    });
};

