const request = require('request');
const config = require('../../config');
// const translate = require('translate-api');
const translate = require('google-translate-api');

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
    }else{
        toLanguage =  'zh-CN';
        fromLanguage =  'en';
    }
    // translate the user message
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
function ischinese(s){
    /*let ret=true;
    for(let i=0;i<s.length;i++)
        ret=ret && (s.charCodeAt(i)>=10000);
    return ret;*/
    let reg = /^([\u4E00-\u9FA5]+，?)+$/;
    let yesorno = s.match(reg) != null;
    return yesorno
}


module.exports = getTranslateResponse;

