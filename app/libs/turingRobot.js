const request = require('request');
const config = require('../../config');

function getTuringResponse(xmlInfo) {
    let info = encodeURI(xmlInfo.content);
    let userId = xmlInfo.fromusername;
    console.log('info:' + xmlInfo.content);
    console.log('userId:' + xmlInfo.fromusername);
    if (typeof info !== 'string') {
        info = info.toString();
    }
    /*var options = {
     method:'GET',
     url: 'http://apis.baidu.com/turing/turing/turing?key=879a6cb3afb84dbf4fc84a1df2ab7319&info='+info,
     headers: {
     'apikey': config.wechatConfig.turingKey
     }
     };*/

    let url_api = 'http://www.tuling123.com/openapi/api';
    let TULING_TOKEN = '3bd9dfac93e44c12b94d7bef705da81b';
    let tulingData = {
        'key': TULING_TOKEN,
        'info': info,   // 收到消息的文字内容
        'loc':'北京市',
        'userid':userId
    };


    return new Promise((resolve, reject) => {
        /*  request(options, function (err, res, body) {
         if (res) {
         resolve(body);
         } else {
         reject(err);
         }
         });*/

        request(url_api, tulingData, function (err, httpResponse, body) {
            if (httpResponse) {
                console.log('ojk:' + httpResponse);
                resolve(body);
            } else {
                reject(err);
            }
        })
    })
}

module.exports = getTuringResponse;