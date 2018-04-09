/**
 * Created by admin on 2018/4/9.
 */


const wxAuth = require('../app/libs/wxAuth');
// var wechat = require('wechat');
let config = require('../config');

module.exports = function(app, express, controllers) {
    let viewPage = express.Router();
    viewPage.route('/').get(function (req, res, next) {
        console.log('routering now 111--------------------------------' + req.method);
        res.render('client');
        next();
    });
    app.use('/view', viewPage);  // 对外请求的path为  /view/...
};