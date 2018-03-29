const request = require('request');
const config = require('../../config');
// const translate = require('translate-api');
const translate = require('google-translate-api');

const turingRobot = require('./turingRobot');


function getTranslateResponse(xmlInfo) {
    let info = encodeURI(xmlInfo.content);
    let userId = xmlInfo.fromusername;
    console.log('info:' + xmlInfo.content);
    console.log('From user\'s userId:' + xmlInfo.fromusername);
    if (typeof info !== 'string') {
        info = info.toString();
    }
    let toLanguage = 'zh-CN';
    let fromLanguage =  'zh-CN';
    if(ischinese(xmlInfo.content)){
        toLanguage = 'en';
        fromLanguage =  'zh-CN';
    } else {
        toLanguage =  'zh-CN';
        fromLanguage =  'en';
    }

    if(xmlInfo.content === '聊天'){

        return new Promise((resolve, reject) => {

           /* turingRobot(xmlInfo).then( resss => {

                let response = JSON.parse(resss);
                console.log('respenseTextTurn:' + response.text);
                resolve(response.text)

             /!*   console.log('respenseText:' + response.text);
                let resMsg = autoReply('text', req.body.xml, response.text);
                console.log('weixinData33dddddd: ' + resMsg);
                console.log('send successfull!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                res.end(resMsg);*!/

                // next();
            },function (err) {
                reject(err)
            })*/

           // use simisi robot
           request.post({url:'http://rebot.me/ask', formData: {username: 'newscnnrobot', question: xmlInfo.content}}, function(err, httpResponse, body){
               console.log('robot say: ' + body);
               if(err){
                   reject(err)
               }else{
                   resolve(body);
               }
           })
        })

    }else if(xmlInfo.content === '翻译'){ // 翻译
        return new Promise((resolve, reject) => {
            // 翻译 info
            translate(xmlInfo.content, {to: toLanguage,from: fromLanguage}).then(resss => {
                console.log("Translate over :" + resss.text);
                console.log(resss.from.language.iso);
                resolve(resss.text)
            }).catch(err => {
                reject(err)
            });
        })
    }

    // translate the user message

}
function ischinese(s){
    let reg = /^([\u4E00-\u9FA5]+，?)+$/;
    return s.match(reg) != null;
}

module.exports = getTranslateResponse;

