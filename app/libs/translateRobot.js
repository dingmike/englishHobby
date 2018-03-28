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

    // translate the user message
    return new Promise((resolve, reject) => {
        // 翻译 info
        translate(xmlInfo.content, {to: 'zh-CN',from: 'en'}).then(resss => {
            console.log("dddddddddddd"+resss.text);
            console.log(resss.from.language.iso);
            //  let resMsg = autoReply('text', req.body.xml, resss.text);
            // res.end(resMsg);
           // return resss.text;
            resolve(resss.text)
        }).catch(err => {
            console.error(err);
        });
    })
}

module.exports = getTranslateResponse;