const crypto = require('crypto');
const path = require('path');
const url = require('url');

//import config
const config = require('../../config');

//进行sha1加密
function sha1(str) {
    let shasum = crypto.createHash("sha1");
    shasum.update(str);
    str = shasum.digest("hex");
    return str;
}

function wechatAuth(req, res, next) {
// console.log( 'contentType:---------'+ res.get('Content-Type'))
    res.get('Content-Type');
    res.writeHead(200, {'Content-Type': 'application/xml'});
    console.log( 'contentType:---------'+ res.get('Content-Type'));
  console.log('resHeader:' + res.head);
  console.log('resAuth:' + res);
  var query = url.parse(req.url, true).query;
  console.log(query);
  var signature = query.signature;
  var echostr = query.echostr;
  var timestamp = query['timestamp'];
  var nonce = query.nonce;

    var reqArray = [nonce, timestamp, config.wechatConfig.token];

    //对数组进行字典排序
    reqArray.sort();
    var sortStr = reqArray.join('');
    var sha1Str = sha1(sortStr);

    if (signature === sha1Str) {
        console.log('getTokenL1ddd111111:' + signature);
        res.end(echostr);
    } else {
        res.end("false");
        console.log("授权失败!");
    }
    next();
}

module.exports = wechatAuth;