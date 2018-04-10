const request = require('request');

function getUserOpenid(wxUrl) {
    return new Promise((resolve, reject) => {
        request.get(wxUrl, function (err, res, body) {
            if (err) {
                console.log('Wechat api error: ' + err);
                reject(err);
            }else {
                resolve(body);
            }
        })
    })
}
module.exports = getUserOpenid;