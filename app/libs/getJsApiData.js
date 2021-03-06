'use strict';
const fs = require('fs');
const request = require('request');
const qs = require('querystring');
const config = require('../../config');
const token = fs.readFileSync('./token').toString();
const sha1 = require('./util').sha1;
const reqUrl = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + token + '&type=jsapi';

function getJsApiTicket() {
  let options = {
    method: 'get',
    url: reqUrl
  };

  return new Promise((resolve, reject) => {
    request(options, function (err, res, body) {
      if (res) {
        resolve(body);
      } else {
        reject(err);
      }
    })
  })
}
function getNonceStr () {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(let i = 0; i < 16; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function getTimestamp() {
  return new Date().valueOf();
}

function getSign(jsApiTicket, noncestr, timestamp, url) {
  console.log('jsApiTicket: ' + jsApiTicket)
  let data = {
    'jsapi_ticket': jsApiTicket,
    'noncestr': noncestr,
    'timestamp': timestamp,
    'url': 'http://newcnn.yiqigo.top/auth'
  };
  let sortData = "jsapi_ticket=" + jsApiTicket + "&noncestr=" + noncestr + "&timestamp=" + timestamp + "&url=" + url;
  console.log('srotdata: ' + sortData);
  return sha1(sortData);
}

//返回数据分别为sign, timestamp, noncestr
function getJsApiData(clientUrl) {
  let noncestr = getNonceStr();
  let timestamp = getTimestamp();
  return getJsApiTicket().then(data => {
      console.log('getToken successfull!!!:' + data);
    return [getSign(JSON.parse(data).ticket, noncestr, timestamp, clientUrl), timestamp, noncestr];
  })
}

module.exports = getJsApiData;