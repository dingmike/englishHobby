let jwt = require("jsonwebtoken");
let bcrypt = require('bcrypt-nodejs');
let moment = require('moment');
let async = require('async');
let mongoose = require('mongoose');
let User = mongoose.model('users');
let requestIp = require('request-ip');
let SECRET_TOKEN = "GUSTA_O0000";

// wechat auth
const getJsApiData = require('../app/libs/getJsApiData');
const config = require('../config');


exports.auth = function (req, res) {
    var clientUrl = 'http://' + req.hostname + req.url;
    getJsApiData(clientUrl).then(data => {

        console.log(data);

       // res.render('base.html', {signature: data[0], timestamp: data[1], nonceStr: data[2], appId: config.appId});
    });
};
