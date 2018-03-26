
const wxAuth = require('../app/libs/wxAuth');


module.exports = function(app, express, controllers) {
    let weixin = express.Router();

    weixin.route('/weixin').post(controllers.weixin.weixin);
    weixin.route('/weixin').get(wxAuth);

    app.use('/wechat', weixin);
};