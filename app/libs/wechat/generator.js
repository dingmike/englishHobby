/**
 * Created by admin on 2018/3/27. 未使用
 */

var sha1 = require('sha1');

module.exports = function(opts){
    return function *(next){
        var token = opts.token;
        var signature = this.query.signature;
        var nonce = this.query.nonce;
        var timestamp = this.query.timestamp;
        var echostr = this.query.echostr;
        var str = [token,timestamp,nonce].sort().join('');
        var sha = sha1(str);
        this.body = (sha === signature) ? echostr + '' : 'failed';
    };
}