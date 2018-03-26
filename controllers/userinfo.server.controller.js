let jwt = require("jsonwebtoken");
let bcrypt = require('bcrypt-nodejs');
let moment = require('moment');
let async = require('async');
let mongoose = require('mongoose');
let User = mongoose.model('users');
let requestIp = require('request-ip');
let SECRET_TOKEN = "GUSTA_O0000";

// wechat auth
const getToken = require('../app/websdk/getWebToken');
const getUserInfo = require('../app/websdk/getWebUserInfo');

exports.userinfo = function (req, res) {
    getToken(req.query.code)
        .then(function (data) {
            return JSON.parse(data);
        })
        .then(function (data) {
            getUserInfo(data['access_token'], data['openid']).then(data => {
                // res.render('user.html', {userinfo: _});

                console.log('data:' + data);
            })
        });
};

