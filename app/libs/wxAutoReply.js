//自动回复消息
const request = require('request');

/**
 *
 * @param msgType {string} 收到的信息的内容
 * @param info {string} 返回消息的内容
 * @returns {string} 返回xml字符串用作消息内容
 */

function autoReply(msgType, requestData, info) {
    switch (msgType) {
        case 'text':
            var resMsg = '<xml>' +
                '<ToUserName><![CDATA[' + requestData.fromusername + ']]></ToUserName>' +
                '<FromUserName><![CDATA[' + requestData.tousername + ']]></FromUserName>' +
                '<CreateTime>' + parseInt(new Date().valueOf() / 1000) + '</CreateTime>' +
                '<MsgType><![CDATA[text]]></MsgType>' +
                '<Content><![CDATA[' + info + ']]></Content>' +
                '<MsgId><![CDATA[' + requestData.msgid + ']]></MsgId>' +
                '</xml>';
            break;
        //关注事件
        case 'subscribe':
            var resMsg = '<xml>' +
                '<ToUserName><![CDATA[' + requestData.fromusername + ']]></ToUserName>' +
                '<FromUserName><![CDATA[' + requestData.tousername + ']]></FromUserName>' +
                '<CreateTime>' + parseInt(new Date().valueOf() / 1000) + '</CreateTime>' +
                '<MsgType><![CDATA[text]]></MsgType>' +
                '<Content><![CDATA[' + info + ']]></Content>' +
                '<MsgId><![CDATA[' + requestData.msgid + ']]></MsgId>' +
                '</xml>';
    }

    console.log('fromusername: ' + requestData.fromusername)
    console.log('tousername: ' + requestData.tousername)
    console.log('msgid: ' + requestData.msgid)
    console.log('CreateTime: ' + parseInt(new Date().valueOf() / 1000))
    console.log('infoOwn: ' + info);
    console.log(resMsg);
    return resMsg;
}

module.exports = autoReply;