
// const wxAuth = require('../app/libs/wxAuth');
// var wechat = require('wechat');
var config = require('../config');

module.exports = function(app, express, controllers) {
    let weixin = express.Router();
    // res.writeHead(200, {'Content-Type': 'application/xml'});
    weixin.route('/').post(controllers.weixin.weixin);
    // weixin.route('/').get(wxAuth);

    // app.use('/wechat', wechat(config.wechatNewConf, controllers.weixin.weixin));
    app.use('/', weixin);
};