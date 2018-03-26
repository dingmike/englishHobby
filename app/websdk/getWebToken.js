/**
 * Created by admin on 2018/3/26.
 */
'use strict';
const request = require('request');
const qs = require('querystring');
const config = require('../../config');

function getToken(code) {
    let reqUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token?';
    let params = {
        appid: config.wechatConfig.appId,
        secret: config.wechatConfig.appSecret,
        code: code,
        grant_type: 'authorization_code'
    };

    let options = {
        method: 'get',
        url: reqUrl+qs.stringify(params)
    };
    console.log(options.url);
    return new Promise((resolve, reject) => {
        request(options, function (err, res, body) {
            if (res) {
                console.log('body: ' + body);
                resolve(body);
            } else {
                reject(err);
            }
        })
    })
}

module.exports = getToken;