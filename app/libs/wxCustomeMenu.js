'use strict';
const fs = require('fs');
const request = require('request');

//token
const token = fs.readFileSync('./token').toString();

console.log('token:' + token);
//常用type为view和click,分别为点击事件和链接


let menus =
{
    "button":[
    {
        "type":"click",
        "name":"今日歌曲",
        "key":"V1001_TODAY_MUSIC"
    },
    {
        "type":"click",
        "name":"歌手简介",
        "key":"V1001_TODAY_SINGER"
    },
    {
        "name":"菜单",
        "sub_button":[
            {
                "type":"view",
                "name":"搜索",
                "url":"http://www.soso.com/"
            },
            {
                "type":"view",
                "name":"视频",
                "url":"http://v.qq.com/"
            },
            {
                "type":"click",
                "name":"赞一下我们",
                "key":"V1001_GOOD"
            }]
    }]
};

function createMenu() {
  let options = {
    url: 'https://api.weixin.qq.com/cgi-bin/menu/create?access_token=' + token,
    form: JSON.stringify(menus),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  
  request.post(options, function (err, res, body) {
    if (err) {
      console.log(err)
    }else {
      console.log('create the menus: ' + body);
    }
  })
  
}

module.exports = createMenu;

