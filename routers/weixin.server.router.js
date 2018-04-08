
const wxAuth = require('../app/libs/wxAuth');
// var wechat = require('wechat');
let config = require('../config');

module.exports = function(app, express, controllers) {
    let weixin = express.Router();
    // res.writeHead(200, {'Content-Type': 'application/xml'});
    //验证微信 get请求
    weixin.route('/auth').get(wxAuth); // 接受微信服务器发起的get请求 进行授权
    weixin.route('/auth').post(controllers.weixin.weixin);  // 为wechat的二级path // 接受微信服务器发起的post请求

    // weixin.route('/').get(wxAuth);
    // app.use('/wechat', wechat(config.wechatNewConf, controllers.weixin.weixin));
    app.use('/wechat', weixin);  // 对外请求的path为  /wechat/...
};