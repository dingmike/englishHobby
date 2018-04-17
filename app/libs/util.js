const parserString = require('xml2js').parseString;
const fs = require('fs');
const crypto = require('crypto');

//将xml转为obj对象
exports.convertXMLtoJSON = function (xml) {
    if (typeof xml !== 'string') {
        console.error('请输入合法的xml字符串');
        return;
    }

    return new Promise((resolve, reject) => {
        parserString(xml, function (err, results) {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        })
    })
};

//判断文件是否存在

exports.isExistSync = function (path) {
    try {
        return typeof fs.statSync(path) === 'object';
    } catch (e) {
        return false;
    }
};


// 从解析的xml数据来看，数据虽然已经呈现键值对的形式，但是其值是数组的形式，需要进行扁平化处理
// 其本质就是遍历数组中的值，因为在多图文的消息中存在嵌套的情况：
exports.formatMessage = function (result) {
    var message = {};
    if (typeof result === 'object') {
        var keys = Object.keys(result);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var item = result[key];
            if (!(item instanceof Array) || item.length === 0) continue;
            if (item.length === 1) {
                var val = item[0];
                if (typeof val === 'object') message[key] = formatMessage(val);
                else message[key] = (val || '').trim();
            } else {
                message[key] = [];
                for (var j = 0, k = item.length; j < k; j++) message[key].push(formatMessage(item[j]));
            }
        }
    }
    return message;
}

exports.sha1 = function (str) {
    let shasum = crypto.createHash("sha1");
    shasum.update(str);
    str = shasum.digest("hex");
    return str;
};


/*
 * 获取真实
 *
 * */

exports.getClientIp = function (req) {
    let ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    return ip.match(/\d+.\d+.\d+.\d+/);
};

// console.log(getClientIp(req));
// let ip = getClientIp(req).match(/\d+.\d+.\d+.\d+/);
// console.log(ip);
// ip = ip ? ip.join('.') : null;
// console.log(ip);